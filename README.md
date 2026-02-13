# resume_agent
AI Human-in-the-Loop Job Matcher

An AI-powered full-stack application that analyzes a user's resume, matches it to job roles, generates intelligent resume improvements using a local LLM (Ollama), and requires human approval before applying.

This project demonstrates real-world AI + full-stack integration.

🧠 How It Works

Upload Resume

Select Target Role

Get Job Recommendation

AI Generates Resume Improvements

User Reviews & Approves Changes

Apply to Job

AI assists — the human stays in control.

🏗️ Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

Backend

FastAPI

Python 3.11+

AI

Ollama

phi3:mini (local LLM)

📂 Project Structure
resume_agent/
│
├── backend/
│   ├── main.py
│   ├── ai_service.py
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md

⚙️ Setup Instructions
1️⃣ Install Ollama

Download from: https://ollama.com

ollama pull phi3:mini


Test it:

ollama run phi3:mini

2️⃣ Start Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Backend runs on:

http://127.0.0.1:8000


API docs:

http://127.0.0.1:8000/docs

3️⃣ Start Frontend
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:8080

🔌 Main API Endpoints

POST /upload-resume

POST /select-role

GET /job

POST /swipe

GET /resume-suggestions

POST /approve-resume

POST /apply

🎯 What This Project Shows

Full-stack system design

Local LLM integration

AI-assisted resume optimization

Human-in-the-loop workflow

Frontend ↔ Backend debugging & integration

👨‍💻 Author

Shrey Kumar
AI & Full Stack Development Project