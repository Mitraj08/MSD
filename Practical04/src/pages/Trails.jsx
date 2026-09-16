import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import trails, { DIFFICULTIES } from '../data/trails.js'
import TrailCard from '../components/TrailCard.jsx'
import './Trails.css'

/**
 * ROUTER STATE-IN-THE-URL EXAMPLE: the difficulty filter is stored
 * in the URL's query string via useSearchParams rather than plain
 * component state. That means the filtered view is a real URL you
 * can bookmark, share, or hit "back" on — e.g. /trails?difficulty=Easy.
 */
function Trails() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeDifficulty = searchParams.get('difficulty') || 'All'
  const [searchTerm, setSearchTerm] = useState('')

  function handleDifficultyChange(difficulty) {
    if (difficulty === 'All') {
      searchParams.delete('difficulty')
    } else {
      searchParams.set('difficulty', difficulty)
    }
    setSearchParams(searchParams)
  }

  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      const matchesDifficulty = activeDifficulty === 'All' || trail.difficulty === activeDifficulty
      const matchesSearch = trail.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      return matchesDifficulty && matchesSearch
    })
  }, [activeDifficulty, searchTerm])

  return (
    <div className="page trails">
      <header className="trails__header">
        <div>
          <h1>All trails</h1>
          <p>{filteredTrails.length} of {trails.length} shown</p>
        </div>
        <input
          type="text"
          className="trails__search"
          placeholder="Search by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search trails"
        />
      </header>

      <div className="trails__filters">
        {['All', ...DIFFICULTIES].map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            className={`trails__pill ${activeDifficulty === difficulty ? 'is-active' : ''}`}
            onClick={() => handleDifficultyChange(difficulty)}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {filteredTrails.length === 0 ? (
        <div className="trails__empty">
          <span>🧭</span>
          <p>No trails match those filters.</p>
        </div>
      ) : (
        <div className="trails__grid">
          {filteredTrails.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Trails
