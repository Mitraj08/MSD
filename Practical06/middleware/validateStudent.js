// middleware/validateStudent.js
// Basic request validation for creating/updating a student record.

const validateStudent = (req, res, next) => {
  const { name, rollNumber, email, course, year, gpa } = req.body;
  const errors = [];

  // For creation, these fields are required.
  // For updates (PATCH-like via PUT here), we only validate fields that are present.
  const isCreate = req.method === "POST";

  if (isCreate || name !== undefined) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("'name' is required and must be a non-empty string");
    }
  }

  if (isCreate || rollNumber !== undefined) {
    if (!rollNumber || typeof rollNumber !== "string") {
      errors.push("'rollNumber' is required and must be a string");
    }
  }

  if (isCreate || email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("'email' is required and must be a valid email address");
    }
  }

  if (isCreate || course !== undefined) {
    if (!course || typeof course !== "string") {
      errors.push("'course' is required and must be a string");
    }
  }

  if (year !== undefined) {
    if (typeof year !== "number" || year < 1 || year > 6) {
      errors.push("'year' must be a number between 1 and 6");
    }
  }

  if (gpa !== undefined && gpa !== null) {
    if (typeof gpa !== "number" || gpa < 0 || gpa > 10) {
      errors.push("'gpa' must be a number between 0 and 10");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = validateStudent;
