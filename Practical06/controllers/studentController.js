// controllers/studentController.js
const studentModel = require("../models/studentModel");

// GET /api/students
// Supports optional filtering: /api/students?course=Computer Science&year=2
const getStudents = (req, res) => {
  const { course, year } = req.query;

  const students =
    course || year
      ? studentModel.filterStudents({ course, year })
      : studentModel.getAllStudents();

  res.status(200).json({ success: true, count: students.length, data: students });
};

// GET /api/students/:id
const getStudent = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = studentModel.getStudentById(id);

  if (!student) {
    return res.status(404).json({ success: false, message: `Student with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: student });
};

// POST /api/students
const createStudent = (req, res) => {
  const { rollNumber } = req.body;

  const existing = studentModel.getStudentByRollNumber(rollNumber);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: `A student with rollNumber '${rollNumber}' already exists`,
    });
  }

  const newStudent = studentModel.createStudent(req.body);
  res.status(201).json({ success: true, data: newStudent });
};

// PUT /api/students/:id
const updateStudent = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (req.body.rollNumber) {
    const existing = studentModel.getStudentByRollNumber(req.body.rollNumber);
    if (existing && existing.id !== id) {
      return res.status(409).json({
        success: false,
        message: `rollNumber '${req.body.rollNumber}' is already used by another student`,
      });
    }
  }

  const updated = studentModel.updateStudent(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: `Student with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: updated });
};

// DELETE /api/students/:id
const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = studentModel.deleteStudent(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: `Student with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: deleted, message: "Student deleted successfully" });
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
