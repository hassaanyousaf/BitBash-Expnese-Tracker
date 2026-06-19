from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware

import database
from schemas import Category, ExpenseCreate, ExpenseResponse, SummaryResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/expenses", response_model=ExpenseResponse, status_code=201)
def create_expense(expense: ExpenseCreate):
    return database.create_expense(expense)


@app.get("/expenses", response_model=list[ExpenseResponse])
def get_expenses(category: Category | None = Query(default=None)):
    return database.list_expenses(category)


@app.delete("/expenses/{expense_id}", status_code=204)
def remove_expense(expense_id: int):
    if not database.delete_expense(expense_id):
        raise HTTPException(status_code=404, detail="Expense not found")
    return Response(status_code=204)


@app.get("/summary", response_model=SummaryResponse)
def summary():
    return database.get_summary()
