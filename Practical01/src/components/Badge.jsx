import './Badge.css'

/**
 * Small label used to tag a recipe's difficulty or attribute.
 * Reused wherever a short piece of categorical info needs a
 * visual chip: cards, the detail modal, filter summaries, etc.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {'neutral'|'accent'|'warm'|'spicy'} [props.tone]
 */
function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export default Badge
