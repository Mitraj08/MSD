import { useEffect, useMemo, useState } from 'react'
import defaultHabits from './data/defaultHabits.js'
import StatsBar from './components/StatsBar.jsx'
import AddHabitForm from './components/AddHabitForm.jsx'
import FilterBar from './components/FilterBar.jsx'
import HabitList from './components/HabitList.jsx'

const STORAGE_KEY = 'ledger-habits'

// Reads any previously-saved habits from localStorage, falling back
// to the sample data on someone's very first visit. Wrapped in a
// function so useState only runs it once, on the initial render.
function loadInitialHabits() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultHabits
  } catch {
    return defaultHabits
  }
}

function App() {
  // ---- STATE MANAGEMENT -----------------------------------------
  // App is the single source of truth for the habits list and the
  // active filter. Every child component below is either handed a
  // slice of this state as props, or a function to change it — the
  // children themselves stay simple and mostly stateless.
  const [habits, setHabits] = useState(loadInitialHabits)
  const [filter, setFilter] = useState('all')

  // A side effect: whenever `habits` changes, save the new value to
  // localStorage so a refresh doesn't lose anything.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits])

  // ---- EVENT HANDLERS PASSED DOWN AS PROPS -----------------------
  // These functions are defined once here and passed to children.
  // The children call them in response to user events (a click, a
  // form submit) without needing to know how `habits` is stored.

  function handleAddHabit(name, category) {
    const newHabit = {
      id: crypto.randomUUID ? crypto.randomUUID() : `h-${Date.now()}`,
      name,
      category,
      streak: 0,
      completedToday: false
    }
    setHabits((prev) => [newHabit, ...prev])
  }

  function handleToggleHabit(id) {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit
        const completedToday = !habit.completedToday
        const streak = completedToday
          ? habit.streak + 1
          : Math.max(0, habit.streak - 1)
        return { ...habit, completedToday, streak }
      })
    )
  }

  function handleDeleteHabit(id) {
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  // ---- DERIVED DATA ------------------------------------------------
  // Computed fresh from state on every render (memoised so it only
  // recalculates when its inputs actually change) rather than stored
  // as separate state — that would risk it getting out of sync.
  const filteredHabits = useMemo(() => {
    if (filter === 'active') return habits.filter((h) => !h.completedToday)
    if (filter === 'completed') return habits.filter((h) => h.completedToday)
    return habits
  }, [habits, filter])

  const stats = useMemo(
    () => ({
      total: habits.length,
      completedToday: habits.filter((h) => h.completedToday).length,
      longestStreak: habits.reduce((max, h) => Math.max(max, h.streak), 0)
    }),
    [habits]
  )

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-header__title">
          Ledger<span>.</span>
        </h1>
        <p className="app-header__sub">A plain log of the habits you're keeping up with.</p>
      </header>

      <StatsBar
        total={stats.total}
        completedToday={stats.completedToday}
        longestStreak={stats.longestStreak}
      />

      <AddHabitForm onAdd={handleAddHabit} />

      <FilterBar value={filter} onChange={setFilter} />

      <HabitList
        habits={filteredHabits}
        onToggle={handleToggleHabit}
        onDelete={handleDeleteHabit}
      />
    </div>
  )
}

export default App
