"""
resume_parser.py
─────────────────────────────────────────────────────────────
Handles all NLP work using Llama 3 via Groq API.
"""

import io
import json
import os
import time
import pdfplumber
from docx import Document
from groq import Groq

# ── Groq client ───────────────────────────────────────────────
client = Groq(api_key="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")


# ── Text extraction ───────────────────────────────────────────
# (UNCHANGED — keeping your exact code)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file given its raw bytes."""
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract all text from a DOCX file given its raw bytes."""
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    paragraphs.append(cell.text.strip())
    return "\n".join(paragraphs)


def extract_text(file_bytes: bytes, filename: str) -> str:
    """Route to the correct extractor based on file extension."""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext in ("doc", "docx"):
        return extract_text_from_docx(file_bytes)
    raise ValueError(f"Unsupported file type: .{ext}")


# ── Llama 3 Parsing via Groq ──────────────────────────────────

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2          # Groq is fast, 2s is enough (was 10s for Ollama)


def _call_groq(prompt: str) -> dict:
    """
    Make a single call to the Groq API. Returns the parsed JSON dict.
    Raises on any failure.
    """
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert resume parser. "
                    "Return ONLY a valid JSON object. "
                    "No markdown, no explanation, no code fences. Raw JSON only."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,                          # Low = consistent JSON output
        max_tokens=1000,
        response_format={"type": "json_object"}   # Groq enforces valid JSON
    )

    generated_json_str = completion.choices[0].message.content.strip()

    # response_format enforces JSON so this shouldn't be needed,
    # but keeping as safety net
    if "```json" in generated_json_str:
        generated_json_str = generated_json_str.split("```json", 1)[1]
        if "```" in generated_json_str:
            generated_json_str = generated_json_str.rsplit("```", 1)[0]

    return json.loads(generated_json_str.strip())


def parse_with_llama3(text: str) -> dict:
    """
    Send the raw resume text to Groq (Llama 3.1 8B) and get a JSON response.
    Retries up to MAX_RETRIES times on rate limit or transient errors.
    """
    # Your exact same prompt — unchanged
    prompt = f"""
You are an expert resume parser. I will provide you with the raw text of a resume.
Please extract the following information and return ONLY a valid JSON object. 
Do not include any explanation or markdown formatting, just the raw JSON string.

The JSON should have exactly the following structure (keep the keys exactly as shown):
{{
  "candidate": {{
    "name": "candidate exact full name or null",
    "email": "candidate email or null",
    "linkedin": "candidate linkedin URL or null"
  }},
  "resume_summary": "A short summary description of the user's resume, based on their skills, certificates, and projects.",
  "preferred_roles": ["List of preferred job roles or domains the user should look for based on their certificates, skills, and projects"],
  "experience_years": "A string representing total experience in years (e.g., '3 years' or 'Not specified')"
}}

Here is the resume text:
{text}
"""

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"[Groq] Attempt {attempt}/{MAX_RETRIES}...")
            result = _call_groq(prompt)
            print(f"[Groq] Success on attempt {attempt}")
            return result

        except Exception as e:
            last_error = e
            error_str = str(e).lower()
            print(f"[Groq] Error on attempt {attempt}: {e}")

            # Rate limit — wait longer
            if "rate_limit" in error_str or "429" in error_str:
                wait = RETRY_DELAY_SECONDS * (2 ** attempt)   # 4s, 8s, 16s
                print(f"[Groq] Rate limited. Waiting {wait}s...")
                time.sleep(wait)

            # Auth error — no point retrying
            elif "401" in error_str or "invalid api key" in error_str:
                raise ValueError("Invalid Groq API key. Check your GROQ_API_KEY environment variable.")

            # JSON parse error — no point retrying
            elif isinstance(e, json.JSONDecodeError):
                raise ValueError(f"Groq returned invalid JSON: {e}")

            # Other transient error
            elif attempt < MAX_RETRIES:
                print(f"[Groq] Waiting {RETRY_DELAY_SECONDS}s before retry...")
                time.sleep(RETRY_DELAY_SECONDS)

    print(f"[Groq] All {MAX_RETRIES} attempts failed.")
    raise ValueError(
        f"Could not get a response from Groq after {MAX_RETRIES} attempts. "
        f"Last error: {last_error}"
    )


# ── Main entry point ──────────────────────────────────────────
# (UNCHANGED — keeping your exact code)

def analyze_resume(
    file_bytes: bytes,
    filename: str,
    user_opportunity: str,
    user_experience: str,
    user_roles: list,
    user_locations: list,
) -> dict:
    """
    Full pipeline: extract text → use Llama 3 via Groq → structure results.
    """
    # 1. Extract raw text
    raw_text = extract_text(file_bytes, filename)
    if not raw_text.strip():
        raise ValueError("Could not extract any text from the uploaded file.")

    # 2. Extract structured data using Llama 3 via Groq
    # 8000 chars is safe — Groq's context window is not a constraint like Ollama's
    llama_data = parse_with_llama3(raw_text[:8_000])

    # 3. Build final JSON structure (identical to before)
    candidate_data = llama_data.get("candidate", {})
    if not isinstance(candidate_data, dict):
        candidate_data = {}

    return {
        "candidate": {
            "name": candidate_data.get("name"),
            "email": candidate_data.get("email"),
            "linkedin": candidate_data.get("linkedin"),
        },
        "resume_summary": llama_data.get("resume_summary", "No summary available."),
        "preferred_roles": llama_data.get("preferred_roles", []),
        "experience_years": str(llama_data.get("experience_years", "Not specified")),
        "user_inputs": {
            "opportunity_type": user_opportunity,
            "experience": user_experience,
            "roles": user_roles,
            "locations": user_locations,
        },
        "raw_text_length": len(raw_text),
    }