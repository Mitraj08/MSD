# Document Management System (MERN)

Stack: MongoDB + Express + React (Vite) + Node.js

## Features
- JWT authentication (register / login), first registered user becomes **admin**
- Upload documents (PDF, Office files, images, txt, csv, zip - max 10 MB)
- Metadata: title, description, category, tags
- Search + filter by category + scope (all / mine / shared with me)
- Version control: upload new versions, download any older version
- Share documents with other users by email
- Download, edit, delete (owner or admin only)
- Dashboard stats (total docs, storage used, shared count)
- Admin panel: list users, change roles, delete users

## Prerequisites
- Node.js 18+
- MongoDB running locally (mongodb://127.0.0.1:27017) OR a MongoDB Atlas URI

## Run

Terminal 1 (API, port 5000):
```
cd server
npm install
npm run dev
```

Terminal 2 (React, port 5173):
```
cd client
npm install
npm run dev
```

Open http://localhost:5173 and register. The first account is the admin.

To use MongoDB Atlas, edit `server/.env` and replace `MONGO_URI`.
Change `JWT_SECRET` before deploying.

## API summary
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/documents | List (search, category, scope) |
| GET | /api/documents/stats | Dashboard stats |
| POST | /api/documents | Upload (multipart: file, title, description, category, tags) |
| PUT | /api/documents/:id | Edit metadata |
| POST | /api/documents/:id/version | Upload new version |
| GET | /api/documents/:id/download?version=N | Download |
| POST | /api/documents/:id/share | Share by email |
| DELETE | /api/documents/:id/share/:userId | Unshare |
| DELETE | /api/documents/:id | Delete |
| GET/PUT/DELETE | /api/users | Admin user management |
