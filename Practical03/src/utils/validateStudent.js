// All validation lives in one place so StudentForm stays focused on
// wiring up the controlled inputs, not on regex.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_PATTERN = /^[A-Za-z\s.'-]+$/
const PHONE_PATTERN = /^[0-9]{10}$/
const ROLL_PATTERN = /^[0-9]+$/

/**
 * Validates one student form's values against business rules and
 * against the rest of the roster (for uniqueness checks).
 *
 * @param {object} values - current controlled-input values
 * @param {object[]} students - the full existing roster
 * @param {string|null} editingId - id of the student being edited,
 *   so that student doesn't collide with itself on a uniqueness check
 * @returns {object} a map of field name -> error message (empty
 *   string values mean no error / field not yet an issue)
 */
export function validateStudent(values, students, editingId) {
  const errors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = 'Name is required.'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = 'Name can only contain letters, spaces, and hyphens.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  } else {
    const isDuplicate = students.some(
      (s) => s.id !== editingId && s.email.toLowerCase() === email.toLowerCase()
    )
    if (isDuplicate) errors.email = 'A student with this email is already registered.'
  }

  const rollNumber = values.rollNumber.trim()
  if (!rollNumber) {
    errors.rollNumber = 'Roll number is required.'
  } else if (!ROLL_PATTERN.test(rollNumber)) {
    errors.rollNumber = 'Roll number must contain digits only.'
  } else {
    const isDuplicate = students.some(
      (s) => s.id !== editingId && s.rollNumber === rollNumber
    )
    if (isDuplicate) errors.rollNumber = 'This roll number is already taken.'
  }

  if (!values.course) {
    errors.course = 'Please select a course.'
  }

  if (!values.year) {
    errors.year = 'Please select a year.'
  }

  const phone = values.phone.trim()
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Phone number must be exactly 10 digits.'
  }

  return errors
}

export const emptyStudentForm = {
  name: '',
  email: '',
  rollNumber: '',
  course: '',
  year: '',
  phone: ''
}
