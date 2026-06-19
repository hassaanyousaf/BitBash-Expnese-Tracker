import sqlite3
from datetime import date, datetime
from pathlib import Path

from schemas import CATEGORIES, Category, ExpenseCreate, ExpenseResponse, SummaryResponse

DB_PATH = Path(__file__).parent / "expenses.db"

DDL = """
CREATE TABLE IF NOT EXISTS expenses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    amount      REAL    NOT NULL CHECK (amount > 0),
    category    TEXT    NOT NULL CHECK (
        category IN ('Food', 'Transport', 'Bills', 'Entertainment', 'Other')
    ),
    note        TEXT    NOT NULL DEFAULT '',
    date        TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category);
"""


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(DDL)
        conn.commit()


def _row_to_expense(row: sqlite3.Row) -> ExpenseResponse:
    return ExpenseResponse(
        id=row["id"],
        amount=row["amount"],
        category=Category(row["category"]),
        note=row["note"],
        date=date.fromisoformat(row["date"]),
        created_at=datetime.fromisoformat(row["created_at"]),
    )


def create_expense(data: ExpenseCreate) -> ExpenseResponse:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO expenses (amount, category, note, date)
            VALUES (?, ?, ?, ?)
            """,
            (data.amount, data.category.value, data.note, data.date.isoformat()),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM expenses WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
    return _row_to_expense(row)


def list_expenses(category: Category | None = None) -> list[ExpenseResponse]:
    with get_connection() as conn:
        if category:
            rows = conn.execute(
                """
                SELECT * FROM expenses
                WHERE category = ?
                ORDER BY date DESC, id DESC
                """,
                (category.value,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM expenses ORDER BY date DESC, id DESC"
            ).fetchall()
    return [_row_to_expense(row) for row in rows]


def delete_expense(expense_id: int) -> bool:
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
        conn.commit()
        return cursor.rowcount > 0


def get_summary() -> SummaryResponse:
    with get_connection() as conn:
        month_total = conn.execute(
            """
            SELECT COALESCE(SUM(amount), 0) FROM expenses
            WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
            """
        ).fetchone()[0]

        rows = conn.execute(
            """
            SELECT category, COALESCE(SUM(amount), 0) AS total FROM expenses
            WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
            GROUP BY category
            """
        ).fetchall()

    by_category = {cat: 0.0 for cat in CATEGORIES}
    for row in rows:
        by_category[row["category"]] = row["total"]

    return SummaryResponse(month_total=month_total, by_category=by_category)
