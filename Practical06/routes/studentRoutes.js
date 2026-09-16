// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const validateStudent = require("../middleware/validateStudent");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.route("/").get(getStudents).post(validateStudent, createStudent);

router
  .route("/:id")
  .get(getStudent)
  .put(validateStudent, updateStudent)
  .delete(deleteStudent);

module.exports = router;
