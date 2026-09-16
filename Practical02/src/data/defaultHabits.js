// Starting data for a first-time visit. After that, the app's own
// state (persisted to localStorage) takes over — see App.jsx.
const defaultHabits = [
  { id: 'h1', name: 'Drink 2L of water', category: 'Health', streak: 4, completedToday: false },
  { id: 'h2', name: 'Read 20 pages', category: 'Mind', streak: 12, completedToday: true },
  { id: 'h3', name: 'Stretch for 10 minutes', category: 'Health', streak: 0, completedToday: false },
  { id: 'h4', name: 'Write in journal', category: 'Mind', streak: 7, completedToday: false }
]

export const categories = ['Health', 'Mind', 'Work', 'Other']

export default defaultHabits
