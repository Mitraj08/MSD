import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getTrailById } from '../data/trails.js'
import './TrailDetail.css'

const difficultyTone = {
  Easy: 'moss',
  Moderate: 'amber',
  Hard: 'clay'
}

/**
 * DYNAMIC ROUTE EXAMPLE: this page is mounted at /trails/:trailId.
 * useParams() reads whatever segment the URL actually has in that
 * position, so the exact same component renders every trail — there
 * is no TrailDetail-for-ridgeline-loop vs TrailDetail-for-sable-falls.
 */
function TrailDetail() {
  const { trailId } = useParams()
  const navigate = useNavigate()
  const trail = getTrailById(trailId)

  // If someone lands on a URL for a trail that doesn't exist (typo,
  // deleted data, etc.), redirect them to the 404 page instead of
  // rendering a broken detail view. <Navigate> performs that
  // redirect declaratively, during render.
  if (!trail) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="page trail-detail">
      {/* useNavigate lets us go back programmatically, e.g. from a
          button click, rather than only ever linking to a fixed path. */}
      <button type="button" className="trail-detail__back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="trail-detail__icon">{trail.icon}</div>
      <h1>{trail.name}</h1>
      <p className="trail-detail__region">{trail.region}</p>

      <div className="trail-detail__meta">
        <span className={`trail-detail__badge trail-detail__badge--${difficultyTone[trail.difficulty]}`}>
          {trail.difficulty}
        </span>
        <span>{trail.distance} mi</span>
        <span>{trail.elevation} ft gain</span>
      </div>

      <p className="trail-detail__description">{trail.description}</p>

      <h2>Highlights</h2>
      <ul className="trail-detail__highlights">
        {trail.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <Link to="/trails" className="trail-detail__all-link">
        See all trails →
      </Link>
    </div>
  )
}

export default TrailDetail
