import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <div className="page about">
      <h1>About Trailhead</h1>
      <p>
        Trailhead is a sample single-page application built to demonstrate client-side routing
        with React Router: a persistent layout, a dynamic detail route, a query-string filter,
        and a catch-all 404 page.
      </p>
      <p>
        Every navigation you've done on this site — clicking a trail card, using the nav bar,
        hitting "Back" — has happened without a single full page reload. React Router swaps the
        matched route's component in and out of the layout's <code>&lt;Outlet /&gt;</code>{' '}
        instead.
      </p>
      <Link to="/trails" className="about__link">
        Go explore the trails →
      </Link>
    </div>
  )
}

export default About
