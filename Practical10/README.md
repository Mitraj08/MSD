# MERN Student Management App

MongoDB + Express + React + Node. Full CRUD with search, pagination and
validation on both client and server.

## Requirements
- Node.js 18+
- MongoDB running locally (mongodb://127.0.0.1:27017) or an Atlas URI in `server/.env`

## Run (one command)
From this folder:
```bash
npm run install-all
npm run dev
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## Run each part separately
```bash
cd server && npm install && npm start
cd client && npm install && npm run dev
```

## Production (single server)
```bash
npm run build      # builds React into client/dist
set NODE_ENV=production   (Windows CMD)   |   $env:NODE_ENV="production"  (PowerShell)
npm start          # Express serves API and the built React app on :5000
```

## API
| Method | Route               | Description                              |
|--------|---------------------|------------------------------------------|
| GET    | /api/students       | List. Query: search, page, limit         |
| GET    | /api/students/:id   | Get one student                          |
| POST   | /api/students       | Create                                   |
| PUT    | /api/students/:id   | Update                                   |
| DELETE | /api/students/:id   | Delete                                   |

## Student fields
name (2-60 chars), email (unique), phone (10 digits), course, year (1-4)

## Structure
```
server/  server.js, models/Student.js, routes/students.js
client/  src/App.jsx, components/StudentForm.jsx, components/StudentTable.jsx, api.js
```
