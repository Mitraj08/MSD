# Ledger — Daily Habit Tracker

A small React app built to demonstrate three core concepts:
**Props**, **State Management**, and **Event Handling**.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## What to look at

```
src/
  App.jsx                 owns ALL state, passes it down as props
  data/defaultHabits.js   sample data used on first visit
  components/
    StatsBar.jsx           pure props, no state — just displays numbers
    AddHabitForm.jsx       LOCAL state (the input box) + event handlers
    FilterBar.jsx          no state, reports clicks up via a prop
    HabitList.jsx          maps an array prop into HabitItem children
    HabitItem.jsx          pure props, calls onToggle/onDelete callbacks
```

### Props
Data flows one way: down. `App` holds the `habits` array and the
`filter` string in state, then hands pieces of that down as props —
`StatsBar` gets three numbers, `HabitList` gets an array and two
functions, `HabitItem` gets a single habit object. None of those
components could tell you where the data actually came from, and
that's the point — they just render whatever props they're given.

### State management
- **`App.jsx`** holds the two pieces of state the whole app cares
  about (`habits`, `filter`) using `useState`, plus a `useEffect`
  that saves `habits` to `localStorage` whenever it changes.
- **`AddHabitForm.jsx`** holds its own *local* state (the text box
  and selected category) with a separate `useState` call, because
  nothing outside that form needs to know what's currently typed.
- Derived values (the filtered list, the stats) are computed with
  `useMemo` from the state above rather than stored separately —
  that avoids two pieces of state ever disagreeing with each other.

This mix is deliberate: it's common for a form's in-progress input
to live locally, while the "committed" data it produces gets lifted
up to a shared parent.

### Event handling
- `AddHabitForm` handles `onChange` (typing, picking a category) and
  `onSubmit` (submitting the form, including `event.preventDefault()`
  to stop a full page reload).
- `HabitItem` handles `onClick` on both the checkbox and the delete
  button, and calls the callback props (`onToggle`, `onDelete`) it
  was given rather than changing anything itself.
- `FilterBar` handles `onClick` on each tab and calls `onChange` with
  the new filter key.

## Requirements

- Node.js 18 or newer
- npm (comes with Node)

No backend or API key needed — habit data is kept in `localStorage`.
