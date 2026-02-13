from enum import Enum
import os

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_service import generate_resume_suggestions
from jobs.service import get_jobs_by_role, get_next_job
from resume.parser import parse_docx, parse_pdf, structure_resume

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

job_sessions = {}
user_state = {
    "resume_uploaded": False,
    "role_selected": False,
    "job_liked": False,
    "resume_approved": False,
    "resume": None,
    "current_job": None,
    "resume_diffs": None,
}


class RoleEnum(str, Enum):
    backend = "backend"
    frontend = "frontend"
    ml = "ml"
    devops = "devops"


class SwipeActionEnum(str, Enum):
    like = "like"
    reject = "reject"


class SelectRoleRequest(BaseModel):
    role: str


class SwipeRequest(BaseModel):
    action: SwipeActionEnum


def generate_resume_diffs(resume, job):
    skills_text = (resume or {}).get("skills", "").strip()
    suggested_skills = skills_text + (", REST APIs" if skills_text else "REST APIs")
    return {
        "skills": [
            {
                "original": skills_text,
                "suggested": suggested_skills,
                "reason": "Backend job emphasizes APIs",
                "approved": False,
            }
        ],
        "projects": [],
        "experience": [],
    }


@app.get(
    "/",
    tags=["System"],
    summary="Health check",
    include_in_schema=False,
)
def root():
    return {"message": "Backend is running"}


@app.post(
    "/upload-resume",
    tags=["Resume"],
    summary="Upload and parse resume",
)
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    file_bytes = await file.read()

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    if file.filename.endswith(".pdf"):
        parsed_text = parse_pdf(file_path)
    elif file.filename.endswith(".docx"):
        parsed_text = parse_docx(file_path)
    else:
        return {"error": "Unsupported file format"}

    structured = structure_resume(parsed_text)
    user_state["resume"] = structured
    user_state["resume_uploaded"] = True
    job_sessions["current"] = {
        "resume_text": parsed_text,
        "jobs": [],
        "index": 0,
        "liked": [],
    }

    return {"message": "Resume uploaded successfully"}


@app.get(
    "/resume-suggestions",
    tags=["Resume"],
    summary="Get job-specific resume suggestions",
)
def resume_suggestions():
    session = job_sessions.get("current")
    if not session:
        return {"error": "No active session"}

    liked_jobs = session.get("liked", [])
    if not liked_jobs:
        return {"error": "No liked job selected"}

    resume_text = session.get("resume_text", "")
    latest_liked_job = liked_jobs[-1]
    job_description = latest_liked_job.get("description", "")

    suggestions = generate_resume_suggestions(resume_text, job_description)
    user_state["resume_diffs"] = {"suggestions": suggestions}
    return {"suggestions": suggestions}


@app.post(
    "/approve-resume",
    tags=["Resume"],
    summary="Approve resume after review",
)
def approve_resume():
    if not user_state.get("resume_diffs"):
        return {"error": "No suggestions to approve"}

    user_state["resume_approved"] = True
    return {"message": "Resume approved"}


@app.post(
    "/select-role",
    tags=["Jobs"],
    summary="Select target job role",
)
def select_role(payload: SelectRoleRequest):
    if not user_state.get("resume_uploaded"):
        return {"error": "Resume must be uploaded before selecting a role"}

    role_input = payload.role.strip()
    normalized_role = role_input.lower()
    role_aliases = {
        "backend": "backend",
        "backend developer": "backend",
        "frontend": "frontend",
        "frontend developer": "frontend",
        "ml": "ml",
        "machine learning": "ml",
        "machine learning engineer": "ml",
        "devops": "devops",
        "devops engineer": "devops",
    }
    role_key = role_aliases.get(normalized_role, normalized_role)

    jobs = get_jobs_by_role(role_key)
    existing_session = job_sessions.get("current", {})
    job_sessions["current"] = {
        "resume_text": existing_session.get("resume_text", ""),
        "jobs": jobs,
        "index": 0,
        "liked": [],
    }
    user_state["role_selected"] = True
    return {"message": f"{len(jobs)} jobs loaded"}


@app.get(
    "/job",
    tags=["Jobs"],
    operation_id="get_next_job",
    summary="Get next job recommendation",
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
    summary="Like or reject current job",
)
def swipe(payload: SwipeRequest):
    if not user_state.get("role_selected"):
        return {"error": "Role must be selected before swiping"}

    session = job_sessions.get("current")
    if not session:
        return {"error": "Role not selected"}

    action = payload.action.value
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
    summary="Apply for selected job",
)
def apply():
    if not user_state.get("resume_approved"):
        return {"error": "Resume must be approved before applying"}
    return {"message": "application sent"}

