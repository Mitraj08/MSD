// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple request logger — helpful when testing with Postman
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Employee Management API is running",
    endpoints: {
      getAllEmployees: "GET /api/employees",
      filterEmployees: "GET /api/employees?department=Engineering&isActive=true&page=1&limit=10",
      getSingleEmployee: "GET /api/employees/:id",
      createEmployee: "POST /api/employees",
      updateEmployee: "PUT /api/employees/:id",
      deleteEmployee: "DELETE /api/employees/:id",
      departmentStats: "GET /api/employees/stats/department",
    },
  });
});

app.use("/api/employees", employeeRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Centralized error handler (must be last) ----------
app.use(errorHandler);

// ---------- Connect to MongoDB Atlas, then start the server ----------
// Connecting first ensures the API never accepts requests before the
// database is actually reachable.
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
