const MAX_LOGS = 50;
const logs = [];

// Custom middleware: logs method, URL, status code and response time,
// and keeps the last 50 requests in memory so the React app can display them.
function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    if (req.originalUrl.startsWith("/api/logs")) return; // don't log the log viewer itself
    logs.unshift({
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ms,
    });
    if (logs.length > MAX_LOGS) logs.pop();
  });
  next();
}

logger.getLogs = () => logs;
logger.clearLogs = () => { logs.length = 0; };

module.exports = logger;
