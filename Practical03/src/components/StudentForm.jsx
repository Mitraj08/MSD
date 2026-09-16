import { useEffect, useState } from 'react'
import FormField from './FormField.jsx'
import { validateStudent, emptyStudentForm } from '../utils/validateStudent.js'
import { COURSES, YEARS } from '../data/options.js'
import './StudentForm.css'

/**
 * CONTROLLED COMPONENT + VALIDATION EXAMPLE.
 *
 * Every input's value is driven entirely by React state (`values`).
 * There is no `defaultValue` or uncontrolled `ref` reading anywhere —
 * the DOM input only ever shows what `values` says it should show,
 * and every keystroke goes through `handleChange` before it's
 * allowed to update that state. That's what makes this a
 * "controlled" form rather than letting the browser manage it.
 *
 * @param {object} props
 * @param {object[]} props.students - full roster, used for uniqueness checks
 * @param {object|null} props.editingStudent - student being edited, or null when adding
 * @param {(student: object) => void} props.onSave
 * @param {() => void} props.onCancelEdit
 */
function StudentForm({ students, editingStudent, onSave, onCancelEdit }) {
  const [values, setValues] = useState(emptyStudentForm)
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // When `editingStudent` changes (someone clicked "Edit" on the
  // list, or clicked "Cancel"), sync the form's controlled state to
  // match. This is the one place values are set from outside typing.
  useEffect(() => {
    setValues(editingStudent ? { ...editingStudent } : emptyStudentForm)
    setTouched({})
    setSubmitAttempted(false)
  }, [editingStudent])

  const errors = validateStudent(values, students, editingStudent?.id ?? null)
  const isValid = Object.keys(errors).length === 0

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitAttempted(true)
    if (!isValid) return

    onSave({
      id: editingStudent ? editingStudent.id : crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}`,
      name: values.name.trim(),
      email: values.email.trim(),
      rollNumber: values.rollNumber.trim(),
      course: values.course,
      year: values.year,
      phone: values.phone.trim()
    })

    if (!editingStudent) {
      setValues(emptyStudentForm)
      setTouched({})
      setSubmitAttempted(false)
    }
  }

  // A field's error only shows once it's been touched, or once the
  // user has tried to submit — not on first render before anyone
  // has interacted with it, which would feel accusatory.
  function shouldShow(field) {
    return Boolean(touched[field] || submitAttempted)
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <h2 className="student-form__title">
        {editingStudent ? 'Edit student' : 'Add a student'}
      </h2>

      <FormField
        label="Full name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        showError={shouldShow('name')}
        required
        placeholder="Jordan Ade"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        showError={shouldShow('email')}
        required
        placeholder="jordan@school.edu"
      />

      <FormField
        label="Roll number"
        name="rollNumber"
        value={values.rollNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.rollNumber}
        showError={shouldShow('rollNumber')}
        required
        placeholder="10423"
      />

      <FormField
        label="Course"
        name="course"
        as="select"
        options={COURSES}
        value={values.course}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.course}
        showError={shouldShow('course')}
        required
      />

      <FormField
        label="Year"
        name="year"
        as="select"
        options={YEARS}
        value={values.year}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.year}
        showError={shouldShow('year')}
        required
      />

      <FormField
        label="Phone (optional)"
        name="phone"
        type="tel"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        showError={shouldShow('phone')}
        placeholder="9876543210"
      />

      <div className="student-form__actions">
        <button type="submit" className="student-form__submit">
          {editingStudent ? 'Save changes' : 'Add student'}
        </button>
        {editingStudent && (
          <button type="button" className="student-form__cancel" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default StudentForm
