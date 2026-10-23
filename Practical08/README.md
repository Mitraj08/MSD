# Practical 08 – Express.js Backend (Routing, Middleware, Request Handling) + React App

A full-stack demo: an **Express.js** API and a multi-page **React** app (Vite + React Router) that uses it.

## Folder structure
```
practical08/
├── package.json                 # npm workspaces root: one install, one run command
├── server/                      # Express.js backend (port 5000)
│   ├── server.js                # entry: middleware + routes
│   ├── middleware/
│   │   ├── logger.js            # logs every request (kept in memory for the UI)
│   │   ├── auth.js              # x-api-key authentication
│   │   └── errorHandler.js      # 404 + central error handler
│   ├── routes/                  # users.js, products.js, logs.js
│   └── controllers/             # userController.js, productController.js
└── client/                      # React app (port 3000)
    ├── index.html
    ├── vite.config.js           # proxies /api -> http://localhost:5000
    └── src/
        ├── main.jsx             # BrowserRouter + ToastProvider
        ├── App.jsx              # route table
        ├── api.js               # fetch wrapper + API functions
        ├── context/ToastContext.jsx
        ├── hooks/               # useFetch.js, useDebounce.js
        ├── components/          # Navbar.jsx, UI.jsx (Loader, ErrorBox, Card...)
        └── pages/               # Dashboard, Users, Products, ApiTester, Logs, NotFound
```

## How to run
Open a terminal **inside the `practical08` folder** (the one that contains `package.json`, `server/` and `client/`).

**One command for everything (npm workspaces):**
```
npm install      # installs root, server and client dependencies in one go
npm run dev      # starts backend (5000) and React app (3000) together
```
Then open http://localhost:3000

**Or run them separately (two terminals):**
```
cd server
npm install
npm start        # backend  -> http://localhost:5000
```
```
cd client
npm install
npm run dev      # frontend -> http://localhost:3000
```
> If a previous install failed, delete the `node_modules` folders and any `package-lock.json` first.

## React app pages
| Page | What it shows |
|---|---|
| Dashboard | server health, uptime, user/product counts (parallel fetch with `Promise.all`) |
| Users | add (with validation), debounced search, inline edit, delete – full CRUD |
| Products | protected route (auth middleware), sorting, live total value |
| API Tester | mini-Postman: pick method/path/body, toggle the API key, see status + response time |
| Request Logs | live view of what the `logger` middleware captured (auto-refresh) |

## React concepts used
`useState`, `useEffect`, `useMemo`, `useCallback`, Context API (toasts), custom hooks (`useFetch`, `useDebounce`), React Router (`NavLink`, `Routes`, 404 page), controlled forms, conditional rendering, lists with keys, loading / error / empty states.

## Express concepts used
- **Routing**: `express.Router()`, GET/POST/PUT/DELETE, route params (`/:id`), query strings (`?search=`).
- **Middleware**: built-in (`express.json`), third-party (`cors`), custom (`logger`, `auth`, validators), error-handling middleware.
- **Request handling**: `req.params`, `req.query`, `req.body`, `req.headers`, status codes, JSON responses.

## API endpoints
| Method | URL | Notes |
|---|---|---|
| GET | /api/health | health check |
| GET | /api/users?search=x | list / search users |
| GET | /api/users/:id | single user |
| POST | /api/users | body `{name, email}` (400 if missing) |
| PUT | /api/users/:id | update user |
| DELETE | /api/users/:id | delete user |
| GET / POST / DELETE | /api/products | requires header `x-api-key: secret123` (401 otherwise) |
| GET / DELETE | /api/logs | recent requests / clear them |
