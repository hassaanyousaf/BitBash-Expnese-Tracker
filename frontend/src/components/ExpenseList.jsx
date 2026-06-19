import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ expenses, loading, onDelete, deletingId }) {
  if (loading) {
    return <p className="status-message status-message--pulse">Loading expenses…</p>
  }

  if (expenses.length === 0) {
    return <p className="status-message">No expenses found.</p>
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense, index) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
          deleting={deletingId === expense.id}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </ul>
  )
}
