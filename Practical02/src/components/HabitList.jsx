import HabitItem from './HabitItem.jsx'
import './HabitList.css'

/**
 * PROPS EXAMPLE: this component receives the already-filtered array
 * plus two callback functions, and just maps over the array to
 * render one HabitItem per habit. It passes each habit's own data
 * down as props, plus two small wrapper functions so each HabitItem
 * can report back which specific habit was toggled or deleted.
 *
 * @param {object} props
 * @param {object[]} props.habits
 * @param {(id: string) => void} props.onToggle
 * @param {(id: string) => void} props.onDelete
 */
function HabitList({ habits, onToggle, onDelete }) {
  if (habits.length === 0) {
    return (
      <div className="habit-list-empty">
        <span>📋</span>
        <p>No habits match this filter yet.</p>
      </div>
    )
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={() => onToggle(habit.id)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </ul>
  )
}

export default HabitList
