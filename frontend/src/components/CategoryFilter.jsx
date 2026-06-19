import { CATEGORIES } from '../constants'

export default function CategoryFilter({ value, onChange }) {
  return (
    <section className="filter-section">
      <p className="filter-section__label">Filter by category</p>
      <div className="filter-bar" role="group" aria-label="Filter expenses by category">
        <button
          type="button"
          className={value === null ? 'filter-btn active' : 'filter-btn'}
          onClick={() => onChange(null)}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={value === category ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  )
}
