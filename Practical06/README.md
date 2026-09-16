# Student Records Management API

A RESTful API built with Express.js for managing student records, with full
CRUD operations, input validation, filtering, and a ready-to-import Postman
collection for testing. Data is stored in memory — no database setup required.

## Project Structure

```
student-records-api/
├── controllers/
│   └── studentController.js   # Request handlers (business logic)
├── middleware/
│   └── validateStudent.js     # Input validation
├── models/
│   └── studentModel.js        # In-memory data store
├── routes/
│   └── studentRoutes.js       # Route definitions
├── server.js                   # App entry point
├── package.json
├── postman_collection.json     # Import this into Postman
└── README.md
```

## Setup

1. Make sure Node.js (v16+) is installed.
2. Open a terminal in this folder and install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   For auto-restart during development:
   ```
   npm run dev
   ```
4. The server runs at: `http://localhost:5000`

## Student Data Model

| Field       | Type    | Required | Notes                              |
|-------------|---------|----------|-------------------------------------|
| id          | number  | auto     | Assigned by the server              |
| name        | string  | yes      |                                      |
| rollNumber  | string  | yes      | Must be unique                      |
| email       | string  | yes      | Must be a valid email format        |
| course      | string  | yes      |                                      |
| year        | number  | no       | 1–6, defaults to 1                  |
| gpa         | number  | no       | 0–10                                 |

## API Endpoints

| Method | Endpoint                              | Description                        |
|--------|----------------------------------------|-------------------------------------|
| GET    | /api/students                          | Get all students                   |
| GET    | /api/students?course=X&year=Y          | Filter students by course/year     |
| GET    | /api/students/:id                      | Get a single student               |
| POST   | /api/students                          | Create a new student               |
| PUT    | /api/students/:id                      | Update a student                   |
| DELETE | /api/students/:id                      | Delete a student                   |

### Example: Create a student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Rohan Verma","rollNumber":"CS2023099","email":"rohan.verma@example.com","course":"Computer Science","year":1,"gpa":8.2}'
```

### Example: Filter students
```bash
curl "http://localhost:5000/api/students?course=Computer%20Science&year=2"
```

### Example: Update a student
```bash
curl -X PUT http://localhost:5000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"gpa": 9.0}'
```

### Example: Delete a student
```bash
curl -X DELETE http://localhost:5000/api/students/1
```

## Testing with Postman

1. Open Postman.
2. Click **Import** → select `postman_collection.json` from this folder.
3. The collection includes a `baseUrl` variable set to `http://localhost:5000`
   and a `studentId` variable set to `1` — edit these in the collection's
   **Variables** tab if needed.
4. Make sure the server is running (`npm start`), then run any request from
   the collection:
   - **API Health Check** — confirms the server is up
   - **Get All Students**
   - **Filter Students by Course & Year**
   - **Get Student By ID**
   - **Create Student**
   - **Update Student**
   - **Delete Student**
   - **Create Student - Validation Error Example** — demonstrates a 400
     response from the validation middleware
5. You can use **Collection Runner** in Postman to run all requests in
   sequence and check response statuses automatically.

## Error Handling

- `400` — validation errors (missing/invalid fields)
- `404` — student not found
- `409` — duplicate rollNumber on create/update
- `500` — unexpected server error

## Notes
- Data resets whenever the server restarts (in-memory storage).
- To persist data, replace the logic in `models/studentModel.js` with a real
  database driver (e.g., Mongoose for MongoDB, or Sequelize for SQL).
- CORS is enabled so the API can be called directly from a frontend app.
