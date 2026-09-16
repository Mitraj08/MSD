import { Link } from 'react-router-dom'
import trails from '../data/trails.js'
import TrailCard from '../components/TrailCard.jsx'
import './Home.css'

function Home() {
  const featured = trails.slice(0, 3)

  return (
    <div className="page home">
      <section className="home__hero">
        <h1>
          Find the trail that fits <em>today</em>.
        </h1>
        <p>
          Six routes across three ranges, each one logged with real distance, elevation, and
          what to expect underfoot.
        </p>
        {/* <Link> navigates without a full page reload, unlike a plain <a> */}
        <Link to="/trails" className="home__cta">
          Browse all trails
        </Link>
      </section>

      <section className="home__featured">
        <h2>Featured this week</h2>
        <div className="home__grid">
          {featured.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
