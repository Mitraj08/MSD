const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");

// GET /api/logs  -> recent requests captured by the logger middleware
router.get("/", (req, res) => res.json(logger.getLogs()));

// DELETE /api/logs -> clear them
router.delete("/", (req, res) => {
  logger.clearLogs();
  res.json({ message: "Logs cleared" });
});

module.exports = router;
