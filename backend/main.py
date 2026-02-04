from fastapi import FastAPI, UploadFile,File
import os
from resume.parser import parse_pdf, parse_docx, structure_resume
from jobs.service import get_jobs_by_role, get_next_job
from enum import Enum

app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
job_sessions = {}
user_state = {
    "resume_uploaded": False,
    "role_selected": False,
    "job_liked": False,
    "resume_approved": False,
    "resume": None,
    "current_job": None
}

class RoleEnum(str, Enum):
    backend = "backend"
    frontend = "frontend"
    ml = "ml"
    devops = "devops"

@app.get(
    "/",
    tags=["System"],
    summary="Health check",
    include_in_schema=False
)
def root():
    return {"message": "Backend is running ??"}

@app.post(
    "/upload-resume",
    tags=["Resume"],
    summary="Upload and parse resume"
)
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
    user_state["resume"] = structured
    user_state["resume_uploaded"] = True

    return {
        "message": "Resume parsed successfully",
        "resume": structured
    }

@app.get(
    "/resume-suggestions",
    tags=["Resume"],
    summary="Get job-specific resume suggestions"
)
def resume_suggestions():
    if not user_state.get("job_liked"):
        return {"error": "Like a job before requesting suggestions"}

    resume = user_state.get("resume")
    job = user_state.get("current_job")

    if not resume or not job:
        return {"error": "Resume not uploaded or job not liked yet"}

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

@app.post(
    "/approve-resume",
    tags=["Resume"],
    summary="Approve resume after review"
)
def approve_resume():
    if not user_state.get("job_liked"):
        return {"error": "Generate suggestions before approving resume"}

    if not user_state.get("resume") or not user_state.get("current_job"):
        return {"error": "Resume or job data missing"}

    user_state["resume_approved"] = True
    return {"message": "Resume approved"}

@app.post(
    "/select-role",
    tags=["Jobs"],
    summary="Select target job role"
)
def select_role(role: RoleEnum):
    if not user_state.get("resume_uploaded"):
        return {"error": "Resume must be uploaded before selecting a role"}

    jobs = get_jobs_by_role(role.value)
    job_sessions["current"] = {
        "jobs": jobs,
        "index": 0,
        "liked": []
    }
    user_state["role_selected"] = True
    return {"message": f"{len(jobs)} jobs loaded"}

@app.get(
    "/job",
    tags=["Jobs"],
    operation_id="get_next_job",
    summary="Get next job recommendation"
)
def get_job():
    if not user_state.get("role_selected"):
        return {"error": "Role must be selected before fetching jobs"}

    session = job_sessions.get("current")
    if not session:
        return {"error": "Role not selected"}

    job = get_next_job(session["jobs"], session["index"])
    if not job:
        return {"message": "No more jobs"}

    return job

@app.post(
    "/swipe",
    tags=["Jobs"],
    summary="Like or reject current job"
)
def swipe(action: str):
    if not user_state.get("role_selected"):
        return {"error": "Role must be selected before swiping"}

    session = job_sessions.get("current")
    if not session:
        return {"error": "Role not selected"}

    if action == "like":
        liked_job = session["jobs"][session["index"]]
        session["liked"].append(liked_job)
        user_state["current_job"] = liked_job
        user_state["job_liked"] = True

    session["index"] += 1
    return {"message": f"Job {action}d"}

@app.post(
    "/apply",
    tags=["Application"],
    summary="Apply for selected job"
)
def apply():
    if not user_state.get("resume_approved"):
        return {"error": "Resume must be approved before applying"}
    return {"message": "application sent"}
