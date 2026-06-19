import { useCallback, useEffect, useState } from 'react'
import * as api from './api'
import CategoryFilter from './components/CategoryFilter'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import SummaryPanel from './components/SummaryPanel'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [filterCategory, setFilterCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadData = useCallback(async (category) => {
    setLoading(true)
    setError(null)
    try {
      const [expenseData, summaryData] = await Promise.all([
        api.getExpenses(category),
        api.getSummary(),
      ])
      setExpenses(expenseData)
      setSummary(summaryData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(filterCategory)
  }, [filterCategory, loadData])

  async function handleCreate(data) {
    await api.createExpense(data)
    await loadData(filterCategory)
  }

  async function handleDelete(id) {
    setDeletingId(id)
    setError(null)
    try {
      await api.deleteExpense(id)
      await loadData(filterCategory)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="app">
      <div className="app__glow app__glow--left" aria-hidden="true" />
      <div className="app__glow app__glow--right" aria-hidden="true" />

      <header className="header">
        <div className="header__brand">
          <span className="header__logo">ledger</span>
          <span className="header__tagline">Expense Tracker</span>
        </div>
        <nav className="header__nav" aria-label="Sections">
          <a href="#add-expense" className="header__link">Add</a>
          <a href="#summary" className="header__link">Summary</a>
          <a href="#expenses" className="header__link">Expenses</a>
        </nav>
      </header>

      <section className="hero">
        <p className="hero__eyebrow">Your finances</p>
        <h1 className="hero__title">
          A clearer view
          <span className="hero__title-sub">within your reach.</span>
        </h1>
        <p className="hero__desc">
          Track spending by category, filter instantly, and see your monthly totals at a glance.
        </p>
      </section>

      {error && (
        <div className="error-banner" role="alert">
          <span className="error-banner__icon">!</span>
          {error}
        </div>
      )}

      <main className="main-grid">
        <div id="add-expense" className="main-grid__form">
          <ExpenseForm onSubmit={handleCreate} />
        </div>
        <div id="summary" className="main-grid__summary">
          <SummaryPanel summary={summary} loading={loading} />
        </div>
      </main>

      <CategoryFilter value={filterCategory} onChange={setFilterCategory} />

      <section id="expenses" className="list-section">
        <div className="list-section__header">
          <h2>Recent Expenses</h2>
          <span className="list-section__hint">Newest first</span>
        </div>
        <ExpenseList
          expenses={expenses}
          loading={loading}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </section>
    </div>
  )
}
