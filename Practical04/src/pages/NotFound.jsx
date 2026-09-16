import { Link } from 'react-router-dom'
import './NotFound.css'

/**
 * CATCH-ALL ROUTE EXAMPLE: mounted at path="*" in App.jsx, so it
 * matches any URL that didn't match one of the more specific routes
 * above it — the routing equivalent of a traditional 404 page.
 */
function NotFound() {
  return (
    <div className="page not-found">
      <span className="not-found__icon">🧭</span>
      <h1>Trail not found</h1>
      <p>This path doesn't lead anywhere on Trailhead. Let's get you back on route.</p>
      <Link to="/" className="not-found__link">
        Back to home
      </Link>
    </div>
  )
}

export default NotFound
