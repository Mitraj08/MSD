import { useState } from 'react'
import { categories } from '../data/defaultHabits.js'
import './AddHabitForm.css'

/**
 * EVENT HANDLING + LOCAL STATE EXAMPLE.
 *
 * This form manages its OWN state (the text box and the selected
 * category) — that state is only useful here and nowhere else in
 * the app, so it doesn't need to live in the parent.
 *
 * It talks to the rest of the app through a single prop: onAdd.
 * That's the common pattern of "lifting state up" — the form
 * doesn't know or care how App stores habits, it just calls the
 * function App gave it and lets App decide what to do.
 *
 * @param {object} props
 * @param {(name: string, category: string) => void} props.onAdd
 */
function AddHabitForm({ onAdd }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0])

  // Handles the "change" event fired every time the user types.
  function handleNameChange(event) {
    setName(event.target.value)
  }

  // Handles the "change" event fired when a new option is picked.
  function handleCategoryChange(event) {
    setCategory(event.target.value)
  }

  // Handles the "submit" event fired when the form is submitted
  // (either by clicking the button or pressing Enter in the input).
  function handleSubmit(event) {
    event.preventDefault() // stop the browser from reloading the page
    const trimmed = name.trim()
    if (!trimmed) return

    onAdd(trimmed, category)
    setName('') // reset local state after a successful submit
  }

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-habit-form__input"
        placeholder="Add a new habit…"
        value={name}
        onChange={handleNameChange}
        aria-label="New habit name"
      />
      <select
        className="add-habit-form__select"
        value={category}
        onChange={handleCategoryChange}
        aria-label="Habit category"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button type="submit" className="add-habit-form__submit" disabled={!name.trim()}>
        Add
      </button>
    </form>
  )
}

export default AddHabitForm
