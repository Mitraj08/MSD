# The Sunday Kitchen — Recipe Box

A small React app that demonstrates **functional components**, **JSX**, and
**component reusability**. It's a recipe box: filter by category, search by
name, and click a card to see the full recipe in a modal.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## What to look at

Every piece of UI is a **functional component** written with **JSX**, and the
small ones are deliberately generic so they get **reused** in more than one
place:

```
src/
  App.jsx                 orchestrates state and composes everything below
  data/recipes.js         sample data (stand-in for an API response)
  components/
    Button.jsx            used in the recipe card, could be used anywhere
    Badge.jsx              used for difficulty, time, servings, and tags
    RatingStars.jsx        used in both the card and the detail modal
    Pill.jsx               the category filter chips
    SearchBar.jsx          a controlled text input, not tied to recipes
    Modal.jsx              generic dialog shell, knows nothing about recipes
    EmptyState.jsx         generic "nothing here" placeholder
    RecipeCard.jsx         composes Badge + RatingStars + Button
    RecipeDetail.jsx       composes Badge + RatingStars, shown inside Modal
```

`Badge`, `RatingStars`, and `Button` each appear in two different places
(`RecipeCard` and `RecipeDetail`) without any changes — that's the
reusability piece. `Modal` and `EmptyState` don't know anything about
recipes at all, so they could be dropped into a completely different app
unchanged.

## Requirements

- Node.js 18 or newer
- npm (comes with Node)

No other setup is needed — there's no backend, database, or API key.
