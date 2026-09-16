# Trailhead

A single-page hiking-trail directory built to demonstrate **React
Router**: multiple pages, a shared layout, a dynamic detail route,
URL-based filtering, and a 404 catch-all — all without a single full
page reload.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`) and
click around — the URL bar updates on every navigation, and the
browser's Back/Forward buttons work correctly, exactly like a
multi-page site, even though only one HTML page is ever loaded.

## What to look at

```
src/
  main.jsx                wraps the app in <BrowserRouter>, once, at the root
  App.jsx                 the route map — every URL-to-component mapping
  layouts/
    RootLayout.jsx          persistent Navbar/Footer + <Outlet /> for pages
  pages/
    Home.jsx                /
    Trails.jsx               /trails            (list + ?difficulty= filter)
    TrailDetail.jsx           /trails/:trailId   (dynamic route, useParams)
    About.jsx                /about
    NotFound.jsx              *                 (catch-all 404)
  components/
    Navbar.jsx               NavLink with active-route styling
    TrailCard.jsx             <Link> to a trail's detail page, reused twice
```

### Routing concepts covered

- **`<BrowserRouter>`** wraps the app once in `main.jsx`, giving every
  component below it access to routing.
- **`<Routes>` / `<Route>`** in `App.jsx` map URLs to components,
  including a **nested route** structure — `RootLayout` is the parent,
  and `Home`, `Trails`, etc. render into its `<Outlet />`.
- **Dynamic segments**: `path="trails/:trailId"` matches
  `/trails/ridgeline-loop`, `/trails/sable-falls`, or any other id,
  and `TrailDetail.jsx` reads whichever one matched via `useParams()`.
- **`<Link>`** (in `TrailCard`, `Home`, `About`) navigates without a
  page reload — compare that to a plain `<a href>`, which would
  reload the whole app.
- **`<NavLink>`** (in `Navbar`) does the same as `<Link>` but also
  knows when its own destination is the current page, so the active
  tab can be styled differently.
- **`useNavigate()`** (in `TrailDetail`'s "← Back" button) navigates
  programmatically — useful for buttons and after actions like a form
  submit, rather than only ever linking to a fixed path.
- **`useSearchParams()`** (in `Trails.jsx`) keeps the difficulty
  filter in the URL's query string (`/trails?difficulty=Easy`), so the
  filtered view is a real, shareable, bookmarkable URL.
- **`<Navigate>`** (in `TrailDetail.jsx`) redirects declaratively —
  if a trail id in the URL doesn't exist, it redirects to `/404`
  instead of rendering a broken page.
- **Catch-all route** (`path="*"`) renders `NotFound` for any URL
  that didn't match one of the routes above it.

## Requirements

- Node.js 18 or newer
- npm (comes with Node)

No backend or API key needed — trail data is a static array in
`src/data/trails.js`.
