from ai.ollama_client import ask_ollama

def analyze_resume(resume_text: str, job_description: str) -> str:
    prompt = f"""
You are an expert technical recruiter.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

TASK:
- Identify missing skills
- Suggest improvements (bullet points)
- Do NOT rewrite the resume
- Keep suggestions concise
"""

    return ask_ollama(prompt)
