import { useMemo, useState } from 'react'
import recipes, { categories } from './data/recipes.js'
import Pill from './components/Pill.jsx'
import SearchBar from './components/SearchBar.jsx'
import RecipeCard from './components/RecipeCard.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import Modal from './components/Modal.jsx'
import EmptyState from './components/EmptyState.jsx'

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchTerm])

  return (
    <div className="app-shell">
      <header className="masthead">
        <div>
          <h1 className="masthead-title">
            The Sunday <em>Kitchen</em>
          </h1>
          <p className="masthead-sub">
            A small box of recipes worth returning to, sorted by what you're in the mood to cook.
          </p>
        </div>
        <div className="masthead-count">
          <strong>{recipes.length}</strong>
          recipes saved
        </div>
      </header>

      <div className="controls-row">
        <div className="pill-row">
          {categories.map((category) => (
            <Pill
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Pill>
          ))}
        </div>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search recipes…" />
      </div>

      <div className="recipe-grid">
        {filteredRecipes.length === 0 ? (
          <EmptyState
            title="No recipes match"
            message="Try a different category or search term."
          />
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={() => setSelectedRecipe(recipe)} />
          ))
        )}
      </div>

      <Modal isOpen={Boolean(selectedRecipe)} onClose={() => setSelectedRecipe(null)}>
        {selectedRecipe && <RecipeDetail recipe={selectedRecipe} />}
      </Modal>
    </div>
  )
}

export default App
