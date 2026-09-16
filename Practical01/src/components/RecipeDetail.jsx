import Badge from './Badge.jsx'
import RatingStars from './RatingStars.jsx'
import './RecipeDetail.css'

const difficultyTone = {
  Easy: 'accent',
  Medium: 'warm',
  Hard: 'spicy'
}

/**
 * Full detail view for one recipe, rendered as the Modal's children.
 * Reuses the same Badge and RatingStars components as the card so
 * the visual language stays consistent everywhere they appear.
 *
 * @param {object} props
 * @param {object} props.recipe
 */
function RecipeDetail({ recipe }) {
  return (
    <div className="recipe-detail">
      <div className="recipe-detail__icon">{recipe.icon}</div>
      <h2>{recipe.name}</h2>

      <div className="recipe-detail__meta">
        <Badge tone={difficultyTone[recipe.difficulty] || 'neutral'}>{recipe.difficulty}</Badge>
        <Badge tone="neutral">{recipe.time} min</Badge>
        <Badge tone="neutral">Serves {recipe.servings}</Badge>
        <RatingStars value={recipe.rating} />
      </div>

      <p className="recipe-detail__desc">{recipe.description}</p>

      <div className="recipe-detail__tags">
        {recipe.tags.map((tag) => (
          <Badge key={tag} tone="accent">
            {tag}
          </Badge>
        ))}
      </div>

      <h3>Ingredients</h3>
      <ul className="recipe-detail__ingredients">
        {recipe.ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default RecipeDetail
