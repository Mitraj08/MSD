import { useMemo, useState } from 'react'
import seedStudents from './data/seedStudents.js'
import StudentForm from './components/StudentForm.jsx'
import StudentList from './components/StudentList.jsx'

function App() {
  // ---- STATE MANAGEMENT -----------------------------------------
  // `students` is the single source of truth for the whole roster.
  // `editingStudent` tracks which one (if any) is currently loaded
  // into the form. `searchTerm` drives the list's filter.
  const [students, setStudents] = useState(seedStudents)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  function handleSave(student) {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id)
      if (exists) {
        return prev.map((s) => (s.id === student.id ? student : s))
      }
      return [student, ...prev]
    })
    setEditingStudent(null)
  }

  function handleEdit(student) {
    setEditingStudent(student)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingStudent(null)
  }

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    if (editingStudent?.id === id) {
      setEditingStudent(null)
    }
  }

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return students
    return students.filter(
      (s) => s.name.toLowerCase().includes(term) || s.rollNumber.includes(term)
    )
  }, [students, searchTerm])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Student Register</h1>
          <p className="app-header__sub">
            Enroll, edit, and search students — every field is validated as you go.
          </p>
        </div>
        <div className="app-header__count">
          <strong>{students.length}</strong>
          enrolled
        </div>
      </header>

      <div className="app-layout">
        <StudentForm
          students={students}
          editingStudent={editingStudent}
          onSave={handleSave}
          onCancelEdit={handleCancelEdit}
        />

        <StudentList
          students={filteredStudents}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editingId={editingStudent?.id ?? null}
        />
      </div>
    </div>
  )
}

export default App
