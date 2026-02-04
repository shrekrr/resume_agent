import pdfplumber
from docx import Document

def parse_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def parse_docx(file_path):
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])

def structure_resume(text):
    sections = {
        "skills": "",
        "projects": "",
        "experience": "",
        "education": ""
    }

    current = None
    for line in text.split("\n"):
        l = line.lower()

        if "skill" in l:
            current = "skills"
        elif "project" in l:
            current = "projects"
        elif "experience" in l:
            current = "experience"
        elif "education" in l:
            current = "education"
        elif current:
            sections[current] += line + "\n"

    return sections
