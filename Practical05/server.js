// server.js
const express = require("express");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Express CRUD API is running",
    endpoints: {
      getAllItems: "GET /api/items",
      getSingleItem: "GET /api/items/:id",
      createItem: "POST /api/items",
      updateItem: "PUT /api/items/:id",
      deleteItem: "DELETE /api/items/:id",
    },
  });
});

app.use("/api/items", itemRoutes);

// ---------- 404 handler (for unknown routes) ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong on the server" });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
