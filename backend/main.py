from fastapi import FastAPI, UploadFile,File
import os
from resume.parser import parse_pdf, parse_docx, structure_resume
from jobs.service import get_jobs_by_role, get_next_job
from enum import Enum

app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
job_sessions = {}

class RoleEnum(str, Enum):
    backend = "backend"
    frontend = "frontend"
    ml = "ml"
    devops = "devops"

@app.post("/select-role")
def select_role(role: RoleEnum):
    jobs = get_jobs_by_role(role.value)
    job_sessions["current"] = {
        "jobs": jobs,
        "index": 0,
        "liked": []
    }
    return {"message": f"{len(jobs)} jobs loaded"}


@app.get("/job")
def get_job():
    session = job_sessions.get("current")
    if not session:
        return {"error": "Role not selected"}

    job = get_next_job(session["jobs"], session["index"])
    if not job:
        return {"message": "No more jobs"}

    return job

@app.post("/swipe")
def swipe(action: str):
    session = job_sessions.get("current")
    if not session:
        return {"error": "Role not selected"}

    if action == "like":
        session["liked"].append(
            session["jobs"][session["index"]]
        )

    session["index"] += 1
    return {"message": f"Job {action}d"}
@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    if file.filename.endswith(".pdf"):
        text = parse_pdf(file_path)
    elif file.filename.endswith(".docx"):
        text = parse_docx(file_path)
    else:
        return {"error": "Unsupported file format"}

    structured = structure_resume(text)

    return {
        "message": "Resume parsed successfully",
        "resume": structured
    }


@app.post("/apply")
def apply():
    return {"status": "application sent"}

@app.get("/resume-suggestions")
def resume_suggestions():
    resume = user_state.get("resume")
    job = user_state.get("current_job")

    if not resume or not job:
        return {
            "error": "Resume not uploaded or job not liked yet"
        }

    return {
        "job_title": job["title"],
        "job_description": job["description"],
        "suggestions": {
            "skills": [
                "Highlight backend technologies relevant to the role",
                "Align skills section with job keywords"
            ],
            "projects": [
                "Emphasize APIs, databases, and server-side logic",
                "Use action verbs aligned with backend responsibilities"
            ],
            "experience": [
                "Rephrase bullets to show impact and scalability"
            ]
        }
    }

