"""
test_api.py  -  Quick end-to-end test for /api/analyze
Run from the backend/ folder:  python test_api.py
"""
import sys
import os
import requests

# ── Create a tiny test resume as a text file disguised as PDF ──
# We'll send a plain DOCX-like test instead — just checking the route
SAMPLE_RESUME_PATH = os.path.join(os.path.dirname(__file__), "test_resume.txt")

SAMPLE_TEXT = """John Doe
Email: john.doe@example.com
Phone: +1-555-123-4567

Summary:
        Software Engineer with 4 years of experience in Python, Django, and React.
        Passionate about machine learning and data science.

Skills:
        Python, JavaScript, React, Django, FastAPI, PostgreSQL, Docker, AWS, Git

Experience:
        Software Engineer @ TechCorp (2020 - 2024)
        - Built REST APIs using FastAPI and Flask
        - 4 years of experience with cloud deployments on AWS

Education:
        B.Tech Computer Science - IIT Delhi (2016-2020)
"""

# We will use the test.docx we just generated instead
SAMPLE_RESUME_PATH = os.path.join(os.path.dirname(__file__), "test.docx")

# Generate the test.docx file so we have a valid file to send
from docx import Document
doc = Document()
doc.add_paragraph(SAMPLE_TEXT)
doc.save(SAMPLE_RESUME_PATH)

print("Sending test request to http://localhost:5000/api/analyze ...")

try:
    with open(SAMPLE_RESUME_PATH, "rb") as f:
        response = requests.post(
            "http://localhost:5000/api/analyze",
            files={"resume": ("test.docx", f, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},

            data={
                "opportunityType": "job",
                "experience":      "4",
                "locations":       "New York,San Francisco",
                "roles":           "Software Engineer,Backend Developer",
            },
            timeout=30,
        )

    print(f"\nStatus code : {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    print(f"Body length : {len(response.text)} chars")
    print(f"\nResponse:\n{response.text[:2000]}")

except requests.exceptions.ConnectionError:
    print("ERROR: Cannot connect to http://localhost:5000 — is the server running?")
except Exception as e:
    print(f"ERROR: {e}")
finally:
    # cleanup
    if os.path.exists(SAMPLE_RESUME_PATH):
        os.remove(SAMPLE_RESUME_PATH)
