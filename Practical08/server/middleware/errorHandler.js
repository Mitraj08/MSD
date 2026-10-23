// 404 handler - runs when no route matched
function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

// Centralised error-handling middleware (4 arguments)
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
}

module.exports = { notFound, errorHandler };
