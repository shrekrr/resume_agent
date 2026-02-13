from ai.resume_analyzer import analyze_resume

resume = "Python developer with Flask experience."
job = "Looking for backend engineer with FastAPI, Docker, and SQL."

print(analyze_resume(resume, job))
