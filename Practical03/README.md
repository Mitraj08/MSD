# Student Register

A React app built to demonstrate **Forms**, **Controlled Components**,
and **Validation** — a small student management system where you can
add, edit, delete, and search students.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## What to look at

```
src/
  App.jsx                     owns the roster, editing state, and search term
  utils/validateStudent.js    all validation rules, in one place
  data/options.js             dropdown options (courses, years)
  data/seedStudents.js        a few students to start with
  components/
    FormField.jsx              reusable controlled input/select + error UI
    StudentForm.jsx            the controlled form itself
    StudentList.jsx            search box + table of students
```

### Controlled components
Every input in `StudentForm` gets its `value` from React state
(`values`) and reports every keystroke back through `onChange` —
nothing is left for the browser's default, uncontrolled input
behaviour to manage. That's what makes `values` in state the single
source of truth: at any instant, what's on screen and what's in
state are guaranteed to match.

### Forms
`StudentForm` uses a real `<form onSubmit>` with `event.preventDefault()`
so the page doesn't reload. Submitting re-runs validation, and if
anything is invalid the form simply won't call `onSave` — the error
messages appear instead. On a successful **add**, the form clears
itself; on a successful **edit**, editing mode closes.

### Validation
`utils/validateStudent.js` checks each field — required-ness, format
(email pattern, 10-digit phone, numeric roll number), and uniqueness
against the rest of the roster (so you can't register the same email
or roll number twice, and editing a student doesn't flag itself as a
duplicate of itself). Errors only appear once a field has been
touched or a submit was attempted, so a blank form doesn't greet you
with a wall of red the moment it loads. Valid, touched fields get a
small green check instead.

## Requirements

- Node.js 18 or newer
- npm (comes with Node)

No backend or API key needed — the roster lives in memory (refreshing
the page resets it to the three seed students).
