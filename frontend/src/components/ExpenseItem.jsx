export default function ExpenseItem({ expense, onDelete, deleting, style }) {
  const formattedAmount = expense.amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <li className="expense-item" style={style}>
      <div className="expense-item__info">
        <span className="expense-item__amount">{formattedAmount}</span>
        <span className="expense-item__category">{expense.category}</span>
        <span className="expense-item__date">{expense.date}</span>
        {expense.note && (
          <span className="expense-item__note">&ldquo;{expense.note}&rdquo;</span>
        )}
      </div>
      <button
        type="button"
        className="btn-delete"
        onClick={() => onDelete(expense.id)}
        disabled={deleting}
        aria-label={`Delete ${expense.category} expense`}
      >
        {deleting ? '…' : 'Delete'}
      </button>
    </li>
  )
}
