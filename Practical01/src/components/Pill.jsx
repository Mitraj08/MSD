import './Pill.css'

/**
 * Toggleable pill used for the category filter row. It's a thin,
 * generic wrapper around a button so the same shape could be reused
 * anywhere a single-select chip is needed.
 *
 * @param {object} props
 * @param {boolean} props.active
 * @param {() => void} props.onClick
 * @param {React.ReactNode} props.children
 */
function Pill({ active = false, onClick, children }) {
  return (
    <button
      type="button"
      className={`pill ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

export default Pill
