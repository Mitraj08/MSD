// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartmentStats,
} = require("../controllers/employeeController");

// Note: specific routes must come before "/:id" so "stats" isn't
// mistaken for an employee id.
router.get("/stats/department", getDepartmentStats);

router.route("/").get(getEmployees).post(createEmployee);

router.route("/:id").get(getEmployee).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
