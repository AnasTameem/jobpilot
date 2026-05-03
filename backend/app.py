"""
app.py  –  CareerAI Flask Backend + Frontend Server
──────────────────────────────────────────────────────────────
Endpoints
  GET  /               → serves the frontend (index.html)
  GET  /<path>         → serves any static frontend file
  POST /api/analyze    → receive resume file + form fields
                         → returns structured JSON analysis
  POST /api/scout      → scouts job listings
  GET  /api/health     → health check
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from resume_parser import analyze_resume

# ── App setup ─────────────────────────────────────────────────
# Frontend files live one level up from this backend/ folder
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)


# ── Serve frontend ────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "landing-page"),
        "index.html",
    )

# ── Catch-all: serve any file from the frontend directory ─────
@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)

@app.route("/resume")
def resume_page():
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "analysis_page"),
        "analysis.html"
    )
@app.route("/analysis")
def analysis_page():
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "analysis_page"),
        "analysis.html"
    )
@app.route("/jobs")
def jobs_page():
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "jobs_page"),
        "job_page.html"
    )

MAX_FILE_SIZE = 10 * 1024 * 1024        # 10 MB
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


def allowed_file(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in ALLOWED_EXTENSIONS


def bad_request(message: str, code: int = 400):
    return jsonify({"success": False, "error": message}), code

@app.errorhandler(Exception)
def handle_exception(e):
    """Ensure any uncaught exceptions return JSON and not HTML."""
    app.logger.exception("Uncaught exception in Flask app")
    code = getattr(e, "code", 500)
    return jsonify({"success": False, "error": f"Server Error: {str(e)}"}), code


# ── Health check ──────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"success": True, "status": "CareerAI backend is running ✅"})


# ── Main analysis endpoint ────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    # ── 1. Validate file presence ───────────────────────────
    if "resume" not in request.files:
        return bad_request("No resume file uploaded. Use field name: 'resume'.")

    file = request.files["resume"]

    if file.filename == "":
        return bad_request("No file selected.")

    if not allowed_file(file.filename):
        return bad_request(
            f"Unsupported file type '{file.filename}'. "
            "Please upload a PDF, DOC, or DOCX file."
        )

    # ── 2. Read file bytes & check size ─────────────────────
    file_bytes = file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        return bad_request("File too large. Maximum allowed size is 10 MB.")

    if not file_bytes:
        return bad_request("Uploaded file appears to be empty.")

    # ── 3. Parse user form fields ────────────────────────────
    opportunity_type = request.form.get("opportunityType", "job").strip().lower()
    if opportunity_type not in ("job", "internship"):
        opportunity_type = "job"

    user_experience = request.form.get("experience", "").strip()

    # Locations come as comma-separated string
    locations_raw = request.form.get("locations", "")
    user_locations = [
        loc.strip().title()
        for loc in locations_raw.split(",")
        if loc.strip()
    ]

    # Roles come as comma-separated string
    roles_raw = request.form.get("roles", "")
    user_roles = [
        role.strip().title()
        for role in roles_raw.split(",")
        if role.strip()
    ]

    # ── 4. Run the NLP pipeline ──────────────────────────────
    try:
        result = analyze_resume(
            file_bytes        = file_bytes,
            filename          = file.filename,
            user_opportunity  = opportunity_type,
            user_experience   = user_experience,
            user_roles        = user_roles,
            user_locations    = user_locations,
        )
    except ValueError as e:
        return bad_request(str(e))
    except Exception as e:
        app.logger.exception("Unexpected error during resume analysis")
        return bad_request(f"Analysis failed: {str(e)}", code=500)

    return jsonify({"success": True, "data": result})


from scout_agent import scout_jobs

@app.route("/api/scout", methods=["POST"])
def scout():
    data = request.get_json()
    if not data:
        return bad_request("Invalid JSON data")
        
    roles = data.get("roles", [])
    locations = data.get("locations", [])
    experience = data.get("experience", "0")
    opportunity_type = data.get("opportunity_type", "job")
    
    try:
        jobs = scout_jobs(
            roles=roles, 
            locations=locations, 
            experience=experience, 
            opportunity_type=opportunity_type
        )
        return jsonify({"success": True, "jobs": jobs})
    except Exception as e:
        app.logger.exception("Unexpected error during job scouting")
        return bad_request(f"Scout failed: {str(e)}", code=500)


# ── Dev entry point ───────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(debug=debug, host="0.0.0.0", port=port)