import ollama

def generate_resume_suggestions(resume_text: str, job_description: str):
    prompt = f"""
You are a professional resume optimization assistant.

Here is the candidate's resume:
-------------------------
{resume_text}
-------------------------

Here is the target job description:
-------------------------
{job_description}
-------------------------

Your task:
1. Identify missing skills.
2. Suggest improvements.
3. Suggest rewritten bullet points.
4. Suggest keywords to add for ATS optimization.

Respond in clean numbered sections.
"""

    response = ollama.chat(
        model="phi3:mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response["message"]["content"]
