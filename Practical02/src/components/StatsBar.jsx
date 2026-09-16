import './StatsBar.css'

/**
 * PROPS EXAMPLE: this component owns no state of its own at all.
 * It just receives numbers from App (its parent) as props and
 * renders them. Whenever the habits change in App, these props
 * change too, and this component re-renders automatically.
 *
 * @param {object} props
 * @param {number} props.total
 * @param {number} props.completedToday
 * @param {number} props.longestStreak
 */
function StatsBar({ total, completedToday, longestStreak }) {
  const stats = [
    { label: 'Habits tracked', value: total },
    { label: 'Done today', value: completedToday },
    { label: 'Longest streak', value: `${longestStreak}d` }
  ]

  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div className="stats-bar__item" key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export default StatsBar
