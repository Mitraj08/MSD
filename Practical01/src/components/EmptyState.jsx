import './EmptyState.css'

/**
 * Generic "nothing to show" placeholder. Takes its icon and copy as
 * props so it can be reused for any empty list in the app, not just
 * a no-search-results state.
 *
 * @param {object} props
 * @param {string} [props.icon]
 * @param {string} props.title
 * @param {string} [props.message]
 */
function EmptyState({ icon = '🍽️', title, message }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  )
}

export default EmptyState
