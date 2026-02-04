import json

with open("jobs/jobs.json") as f:
    JOBS = json.load(f)

def get_jobs_by_role(role):
    return [job for job in JOBS if job["role"] == role]

def get_next_job(jobs, index):
    if index < len(jobs):
        return jobs[index]
    return None
