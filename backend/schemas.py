from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field


class Category(str, Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    BILLS = "Bills"
    ENTERTAINMENT = "Entertainment"
    OTHER = "Other"


CATEGORIES = [c.value for c in Category]


class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0)
    category: Category
    note: str = Field(default="", max_length=500)
    date: date


class ExpenseResponse(ExpenseCreate):
    id: int
    created_at: datetime


class SummaryResponse(BaseModel):
    month_total: float
    by_category: dict[str, float]
