# Expense Tracker

A localhost-only single-page expense tracker built with FastAPI + SQLite and React (Vite).

## Features

- **Create** — Add expenses (amount, category, note, date)
- **Read** — List expenses, newest first
- **Delete** — Remove an expense
- **Summary** — Total for the current month + breakdown per category
- **Filter** — Filter the list by category (Food, Transport, Bills, Entertainment, Other)

## Prerequisites

- Python 3.11+
- Node.js 18+

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

API docs: http://localhost:8080/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:3000
