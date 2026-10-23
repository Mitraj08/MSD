// Custom middleware: simple API-key authentication
// Client must send header:  x-api-key: secret123
module.exports = function auth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== "secret123") {
    return res.status(401).json({ error: "Unauthorized: missing or invalid x-api-key header" });
  }
  next();
};
