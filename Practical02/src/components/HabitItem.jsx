import './HabitItem.css'

const categoryColor = {
  Health: 'teal',
  Mind: 'accent',
  Work: 'neutral',
  Other: 'neutral'
}

/**
 * PROPS + EVENT HANDLING EXAMPLE.
 *
 * Everything this component shows comes in as props from its
 * parent (HabitList, which got it from App). It has no state of
 * its own — it's a "controlled" / "presentational" component.
 *
 * Clicking the checkbox or the delete button doesn't change
 * anything here directly; it calls the callback props (onToggle,
 * onDelete) and lets App — the component that actually owns the
 * habits array — decide how state should change.
 *
 * @param {object} props
 * @param {object} props.habit
 * @param {() => void} props.onToggle
 * @param {() => void} props.onDelete
 */
function HabitItem({ habit, onToggle, onDelete }) {
  const tone = categoryColor[habit.category] || 'neutral'

  return (
    <li className={`habit-item ${habit.completedToday ? 'is-done' : ''}`}>
      <button
        type="button"
        className="habit-item__check"
        onClick={onToggle}
        aria-pressed={habit.completedToday}
        aria-label={`Mark ${habit.name} as ${habit.completedToday ? 'not done' : 'done'} today`}
      >
        {habit.completedToday ? '✓' : ''}
      </button>

      <div className="habit-item__body">
        <p className="habit-item__name">{habit.name}</p>
        <span className={`habit-item__category habit-item__category--${tone}`}>
          {habit.category}
        </span>
      </div>

      <div className="habit-item__streak" title="Current streak">
        🔥 {habit.streak}
      </div>

      <button
        type="button"
        className="habit-item__delete"
        onClick={onDelete}
        aria-label={`Delete ${habit.name}`}
      >
        ✕
      </button>
    </li>
  )
}

export default HabitItem
