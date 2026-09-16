import './FilterBar.css'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
]

/**
 * PROPS + EVENT HANDLING EXAMPLE.
 *
 * This component holds no state itself. The "current" filter lives
 * in App's state; this just displays it and reports clicks back up
 * via the onChange prop. That's the same lifting-state-up pattern
 * as AddHabitForm, just without any local state of its own.
 *
 * @param {object} props
 * @param {'all'|'active'|'completed'} props.value
 * @param {(next: string) => void} props.onChange
 */
function FilterBar({ value, onChange }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Filter habits">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          role="tab"
          aria-selected={value === filter.key}
          className={`filter-bar__tab ${value === filter.key ? 'is-active' : ''}`}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
