// controllers/employeeController.js
const Employee = require("../models/Employee");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/employees
// Supports optional filtering and pagination:
// /api/employees?department=Engineering&isActive=true&page=1&limit=10
const getEmployees = asyncHandler(async (req, res) => {
  const { department, isActive, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const skip = (Number(page) - 1) * Number(limit);

  const [employees, total] = await Promise.all([
    Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Employee.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: employees.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: employees,
  });
});

// GET /api/employees/:id
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }
  res.status(200).json({ success: true, data: employee });
});

// POST /api/employees
const createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, data: employee });
});

// PUT /api/employees/:id
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document
    runValidators: true, // enforce schema validation on update
  });

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }
  res.status(200).json({ success: true, data: employee });
});

// DELETE /api/employees/:id
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }
  res.status(200).json({
    success: true,
    data: employee,
    message: "Employee deleted successfully",
  });
});

// GET /api/employees/stats/department
// Bonus aggregate endpoint: average salary & headcount per department
const getDepartmentStats = asyncHandler(async (req, res) => {
  const stats = await Employee.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$department",
        headcount: { $sum: 1 },
        averageSalary: { $avg: "$salary" },
      },
    },
    { $sort: { headcount: -1 } },
  ]);

  res.status(200).json({ success: true, data: stats });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartmentStats,
};
