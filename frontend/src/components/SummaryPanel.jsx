import { CATEGORIES } from '../constants'

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export default function SummaryPanel({ summary, loading }) {
  if (loading || !summary) {
    return (
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Summary</h2>
          <p className="panel__subtitle">This month</p>
        </div>
        <p className="status-message status-message--pulse">Loading summary…</p>
      </section>
    )
  }

  const maxCategory = Math.max(
    ...CATEGORIES.map((cat) => summary.by_category[cat] ?? 0),
    1,
  )

  return (
    <section className="panel summary-panel">
      <div className="panel__header">
        <h2 className="panel__title">Summary</h2>
        <p className="panel__subtitle">This month</p>
      </div>

      <div className="summary-panel__total-wrap">
        <p className="summary-panel__label">Total spent</p>
        <p className="summary-total">{formatCurrency(summary.month_total)}</p>
      </div>

      <ul className="summary-breakdown">
        {CATEGORIES.map((category) => {
          const amount = summary.by_category[category] ?? 0
          const width = (amount / maxCategory) * 100

          return (
            <li key={category} className="summary-breakdown__item">
              <div className="summary-breakdown__row">
                <span className="summary-breakdown__category">{category}</span>
                <span className="summary-breakdown__amount">{formatCurrency(amount)}</span>
              </div>
              <div className="summary-breakdown__bar">
                <div
                  className="summary-breakdown__fill"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
