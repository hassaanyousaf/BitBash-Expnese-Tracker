import { useState } from 'react'
import { CATEGORIES } from '../constants'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function ExpenseForm({ onSubmit }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const parsed = parseFloat(amount)
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      return 'Amount must be greater than 0'
    }
    if (note.length > 500) {
      return 'Note must be 500 characters or less'
    }
    if (!date) {
      return 'Date is required'
    }
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({
        amount: parseFloat(amount),
        category,
        note,
        date,
      })
      setAmount('')
      setNote('')
      setDate(todayISO())
      setCategory(CATEGORIES[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Add Expense</h2>
        <p className="panel__subtitle">Amount, category, note, and date</p>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="expense-form__field--full">
          Note
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional description"
            maxLength={500}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Expense'}
        </button>
      </form>
    </section>
  )
}
