# MERN Blog Management System

Blog platform with CRUD, JWT authentication and role-based access control (RBAC).

## Requirements
- Node.js 18+
- MongoDB running locally (mongodb://127.0.0.1:27017) or an Atlas URI in `server/.env`

## Run
From this folder (IMPORTANT: use `install-all`, not plain `npm install`):
```bash
npm run install-all
npm run dev
```
Open http://localhost:5173  (API runs on http://localhost:5000)

## Default admin (created automatically on first start)
- Email: `admin@blog.com`
- Password: `Admin@1234`

Change these in `server/.env` (ADMIN_EMAIL / ADMIN_PASSWORD) **before** the first run,
and set a long random JWT_SECRET.

## Roles
| Action                                  | Visitor | Reader | Author | Admin |
|-----------------------------------------|:-------:|:------:|:------:|:-----:|
| Read published posts                    |   yes   |  yes   |  yes   |  yes  |
| Create posts (draft or published)       |         |        |  yes   |  yes  |
| Edit / delete own posts                 |         |        |  yes   |  yes  |
| Edit / delete anyone's posts            |         |        |        |  yes  |
| See other people's drafts               |         |        |        |  yes  |
| Manage users (change role, delete)      |         |        |        |  yes  |

Sign-up lets people choose Reader or Author. Admin accounts can only be created by
the seeded admin, who promotes users from the Users page.

## API
Auth: send `Authorization: Bearer <token>`

| Method | Route                  | Access          | Description                    |
|--------|------------------------|-----------------|--------------------------------|
| POST   | /api/auth/register     | public          | Create account (reader/author) |
| POST   | /api/auth/login        | public          | Log in, returns token          |
| GET    | /api/auth/me           | logged in       | Current user                   |
| GET    | /api/posts             | public          | Published posts (search, tag, page, limit) |
| GET    | /api/posts/manage      | author, admin   | Own posts (admin: all posts)   |
| GET    | /api/posts/:id         | public*         | One post (*drafts: owner/admin)|
| POST   | /api/posts             | author, admin   | Create post                    |
| PUT    | /api/posts/:id         | owner, admin    | Update post                    |
| DELETE | /api/posts/:id         | owner, admin    | Delete post                    |
| GET    | /api/users             | admin           | List users                     |
| PATCH  | /api/users/:id/role    | admin           | Change a user's role           |
| DELETE | /api/users/:id         | admin           | Delete user and their posts    |

## Structure
```
server/  server.js, models/, middleware/auth.js, routes/
client/  src/AuthContext.jsx, components/, pages/
```
