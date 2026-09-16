import Badge from './Badge.jsx'
import RatingStars from './RatingStars.jsx'
import Button from './Button.jsx'
import './RecipeCard.css'

const difficultyTone = {
  Easy: 'accent',
  Medium: 'warm',
  Hard: 'spicy'
}

/**
 * A single recipe preview. This is where several small reusable
 * components (Badge, RatingStars, Button) are composed together
 * into one larger, purpose-built piece of UI.
 *
 * @param {object} props
 * @param {object} props.recipe
 * @param {() => void} props.onOpen
 */
function RecipeCard({ recipe, onOpen }) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__icon">{recipe.icon}</div>

      <div className="recipe-card__body">
        <div className="recipe-card__tags">
          <Badge tone={difficultyTone[recipe.difficulty] || 'neutral'}>{recipe.difficulty}</Badge>
          <Badge tone="neutral">{recipe.time} min</Badge>
        </div>

        <h3 className="recipe-card__title">{recipe.name}</h3>
        <p className="recipe-card__desc">{recipe.description}</p>

        <div className="recipe-card__footer">
          <RatingStars value={recipe.rating} />
          <Button variant="ghost" size="sm" onClick={onOpen}>
            View recipe
          </Button>
        </div>
      </div>
    </article>
  )
}

export default RecipeCard
