import { Link } from 'react-router-dom'
import './TrailCard.css'

const difficultyTone = {
  Easy: 'moss',
  Moderate: 'amber',
  Hard: 'clay'
}

/**
 * ROUTER LINK EXAMPLE: uses <Link>, not a plain <a>, so navigating
 * to a trail's detail page doesn't trigger a full page reload — the
 * router just swaps the matched route inside <Outlet />.
 *
 * Reused on both the Home page (featured trails) and the Trails
 * listing page with no changes needed.
 *
 * @param {object} props
 * @param {object} props.trail
 */
function TrailCard({ trail }) {
  return (
    <Link to={`/trails/${trail.id}`} className="trail-card">
      <div className="trail-card__icon">{trail.icon}</div>
      <div className="trail-card__body">
        <div className="trail-card__meta">
          <span className={`trail-card__badge trail-card__badge--${difficultyTone[trail.difficulty]}`}>
            {trail.difficulty}
          </span>
          <span className="trail-card__stat">{trail.distance} mi</span>
          <span className="trail-card__stat">{trail.elevation} ft gain</span>
        </div>
        <h3 className="trail-card__title">{trail.name}</h3>
        <p className="trail-card__region">{trail.region}</p>
        <p className="trail-card__summary">{trail.summary}</p>
      </div>
    </Link>
  )
}

export default TrailCard
