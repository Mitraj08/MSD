# Employee Management API

A RESTful API built with Express.js and MongoDB Atlas (via Mongoose) for
managing employee records. Includes CRUD operations, filtering, pagination,
schema validation, a department stats endpoint, centralized error handling,
and a ready-to-import Postman collection.

## Project Structure

```
employee-management-api/
├── config/
│   └── db.js                   # MongoDB Atlas connection (Mongoose)
├── controllers/
│   └── employeeController.js   # Request handlers (business logic)
├── middleware/
│   ├── asyncHandler.js         # Wraps async routes, forwards errors
│   └── errorHandler.js         # Centralized error responses
├── models/
│   └── Employee.js             # Mongoose schema/model
├── routes/
│   └── employeeRoutes.js       # Route definitions
├── server.js                    # App entry point
├── package.json
├── .env.example                 # Copy to .env and fill in your Atlas URI
├── postman_collection.json      # Import this into Postman
└── README.md
```

## 1. Set Up MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and
   sign up / log in.
2. Create a **free cluster** (M0 tier is fine).
3. Under **Database Access**, create a database user with a username and
   password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` to allow
   access from anywhere — fine for development, not recommended for
   production).
5. Click **Connect** on your cluster → **Drivers** → copy the connection
   string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user's
   credentials, and add a database name before the `?`, e.g.
   `.../employee_management?retryWrites=true...`

## 2. Configure the Project

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and paste your connection string into `MONGODB_URI`.

## 3. Install & Run

```bash
npm install
npm start
```
For auto-restart during development:
```bash
npm run dev
```

If everything is configured correctly, you'll see:
```
MongoDB connected: <your-cluster-host>
Server running at http://localhost:5000
```

If `MONGODB_URI` is missing or wrong, the server prints a clear error message
and exits instead of crashing with a raw stack trace.

## Employee Schema

| Field         | Type    | Required | Notes                                |
|---------------|---------|----------|----------------------------------------|
| name          | String  | yes      |                                          |
| email         | String  | yes      | Must be valid & unique                 |
| phone         | String  | no       |                                          |
| position      | String  | yes      |                                          |
| department    | String  | yes      |                                          |
| salary        | Number  | yes      | Must be >= 0                           |
| dateOfJoining | Date    | no       | Defaults to now                        |
| isActive      | Boolean | no       | Defaults to true                       |
| createdAt     | Date    | auto     | Set by Mongoose timestamps             |
| updatedAt     | Date    | auto     | Set by Mongoose timestamps             |

## API Endpoints

| Method | Endpoint                                                        | Description                          |
|--------|------------------------------------------------------------------|----------------------------------------|
| GET    | /api/employees                                                   | Get all employees                    |
| GET    | /api/employees?department=X&isActive=true&page=1&limit=10        | Filter + paginate                    |
| GET    | /api/employees/:id                                                | Get a single employee                |
| POST   | /api/employees                                                    | Create a new employee                |
| PUT    | /api/employees/:id                                                | Update an employee                   |
| DELETE | /api/employees/:id                                                | Delete an employee                   |
| GET    | /api/employees/stats/department                                  | Headcount & avg salary per department|

### Example: Create an employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya Nair","email":"priya.nair@example.com","position":"Backend Developer","department":"Engineering","salary":85000}'
```

### Example: Filter + paginate
```bash
curl "http://localhost:5000/api/employees?department=Engineering&isActive=true&page=1&limit=10"
```

### Example: Update an employee
```bash
curl -X PUT http://localhost:5000/api/employees/<id> \
  -H "Content-Type: application/json" \
  -d '{"salary": 92000}'
```

### Example: Delete an employee
```bash
curl -X DELETE http://localhost:5000/api/employees/<id>
```

### Example: Department stats
```bash
curl http://localhost:5000/api/employees/stats/department
```

## Testing with Postman

1. Open Postman → **Import** → select `postman_collection.json`.
2. Set the `baseUrl` variable (defaults to `http://localhost:5000`).
3. Run **Create Employee** first, then copy the `_id` from the response into
   the `employeeId` collection variable.
4. Run the remaining requests:
   - **Get All Employees**
   - **Filter + Paginate Employees**
   - **Get Employee By ID**
   - **Create Employee - Duplicate Email (expect 409)**
   - **Create Employee - Validation Error (expect 400)**
   - **Update Employee**
   - **Get Department Stats**
   - **Delete Employee**
5. Use Postman's **Collection Runner** to run the whole set and check status
   codes automatically.

## Error Handling

- `400` — Mongoose validation errors, or an invalid ID format
- `404` — employee not found
- `409` — duplicate email (unique index violation)
- `500` — unexpected server error

## Notes
- Because MongoDB assigns each document a unique `_id`, you'll get real
  MongoDB ObjectIds back (e.g. `"_id": "664f1c2e5a1b2c3d4e5f6789"`) instead of
  simple incrementing numbers.
- `isActive` is used instead of hard-deleting employees in some workflows —
  you can adapt `deleteEmployee` to set `isActive: false` instead of removing
  the document if you want a "soft delete" pattern.
- CORS is enabled so the API can be called directly from a frontend app.
