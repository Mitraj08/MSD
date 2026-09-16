import { NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/trails', label: 'Trails' },
  { to: '/about', label: 'About' }
]

/**
 * ROUTER NAVIGATION EXAMPLE: NavLink (as opposed to plain Link)
 * automatically knows whether its own `to` matches the current URL
 * and lets us style that state via the `className` function below —
 * no manual "which page am I on" state needed anywhere.
 */
function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" end>
          🥾 Trailhead
        </NavLink>
        <nav className="navbar__links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
