// middleware/errorHandler.js
// Centralized error handler. Translates common Mongoose errors into
// clean JSON responses instead of leaking stack traces to the client.

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Invalid ObjectId (e.g. GET /api/employees/not-a-valid-id)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `An employee with that ${field} already exists`;
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
