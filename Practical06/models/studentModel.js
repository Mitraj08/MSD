// models/studentModel.js
// In-memory "database" (an array of student records).
// Swap this out for Mongoose/Sequelize later if you need real persistence.

let students = [
  {
    id: 1,
    name: "Aarav Sharma",
    rollNumber: "CS2023001",
    email: "aarav.sharma@example.com",
    course: "Computer Science",
    year: 2,
    gpa: 8.7,
  },
  {
    id: 2,
    name: "Diya Patel",
    rollNumber: "EC2023045",
    email: "diya.patel@example.com",
    course: "Electronics",
    year: 3,
    gpa: 9.1,
  },
];

let nextId = 3;

const getAllStudents = () => students;

const getStudentById = (id) => students.find((s) => s.id === id);

const getStudentByRollNumber = (rollNumber) =>
  students.find((s) => s.rollNumber.toLowerCase() === String(rollNumber).toLowerCase());

const createStudent = (data) => {
  const newStudent = {
    id: nextId++,
    name: data.name,
    rollNumber: data.rollNumber,
    email: data.email,
    course: data.course,
    year: data.year || 1,
    gpa: data.gpa ?? null,
  };
  students.push(newStudent);
  return newStudent;
};

const updateStudent = (id, data) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  students[index] = {
    ...students[index],
    ...data,
    id: students[index].id, // id is immutable
  };
  return students[index];
};

const deleteStudent = (id) => {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const deleted = students[index];
  students.splice(index, 1);
  return deleted;
};

const filterStudents = ({ course, year }) => {
  return students.filter((s) => {
    const matchesCourse = course ? s.course.toLowerCase() === course.toLowerCase() : true;
    const matchesYear = year ? s.year === Number(year) : true;
    return matchesCourse && matchesYear;
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByRollNumber,
  createStudent,
  updateStudent,
  deleteStudent,
  filterStudents,
};
