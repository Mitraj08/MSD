import './RatingStars.css'

/**
 * Displays a 1-5 star rating. Purely presentational and stateless,
 * so it can be dropped into a card, a modal, or a list row and
 * always render the same way for the same value.
 *
 * @param {object} props
 * @param {number} props.value - rating from 0 to max
 * @param {number} [props.max] - number of stars total
 */
function RatingStars({ value, max = 5 }) {
  const stars = Array.from({ length: max }, (_, i) => i < value)

  return (
    <div className="rating" aria-label={`Rated ${value} out of ${max}`}>
      {stars.map((filled, i) => (
        <span key={i} className={`rating__star ${filled ? 'is-filled' : ''}`} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  )
}

export default RatingStars
