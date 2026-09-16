# Express CRUD API

A simple, ready-to-run Express.js backend implementing routing and full CRUD
(Create, Read, Update, Delete) operations for an "items" resource.
Data is stored in memory, so there is no database to configure — it just works.

## Project Structure

```
express-crud-api/
├── controllers/
│   └── itemController.js   # Request handlers (business logic)
├── models/
│   └── itemModel.js        # In-memory data store
├── routes/
│   └── itemRoutes.js       # Route definitions
├── server.js                # App entry point
├── package.json
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
   For auto-restart on file changes during development:
   ```
   npm run dev
   ```
4. The server runs at: `http://localhost:5000`

## API Endpoints

| Method | Endpoint          | Description         |
|--------|-------------------|----------------------|
| GET    | /api/items        | Get all items        |
| GET    | /api/items/:id    | Get a single item    |
| POST   | /api/items        | Create a new item    |
| PUT    | /api/items/:id    | Update an item       |
| DELETE | /api/items/:id    | Delete an item       |

### Example: Create an item
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Keyboard", "description": "Mechanical keyboard", "price": 2500}'
```

### Example: Get all items
```bash
curl http://localhost:5000/api/items
```

### Example: Update an item
```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 70000}'
```

### Example: Delete an item
```bash
curl -X DELETE http://localhost:5000/api/items/1
```

## Notes
- Data resets every time the server restarts (in-memory storage).
- To persist data, replace the logic in `models/itemModel.js` with a real
  database driver (e.g., Mongoose for MongoDB, or Sequelize for SQL).
- CORS is enabled by default so you can call this API from a frontend app.
