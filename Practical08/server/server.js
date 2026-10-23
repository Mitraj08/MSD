const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const logRoutes = require("./routes/logs");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Built-in & third-party middleware ----------
app.use(cors());                 // allow the React app (port 3000) to call this API
app.use(express.json());         // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies

// ---------- Custom application-level middleware ----------
app.use(logger);                 // logs every request

// ---------- Basic routes ----------
app.get("/", (req, res) => {
  res.json({ message: "Practical 08 - Express.js backend is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime(), time: new Date().toISOString() });
});

// ---------- Router-level routes ----------
app.use("/api/users", userRoutes);                 // public
app.use("/api/products", auth, productRoutes);     // protected by auth middleware
app.use("/api/logs", logRoutes);                   // request log viewer

// ---------- 404 + error handling middleware ----------
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
