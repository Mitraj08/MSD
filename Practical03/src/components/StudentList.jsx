import './StudentList.css'

/**
 * PROPS EXAMPLE: purely presentational. It receives the already
 * search-filtered array plus a couple of callbacks, and has no
 * state of its own — even the search input's value is passed in
 * from App so App remains the one source of truth for it too.
 *
 * @param {object} props
 * @param {object[]} props.students
 * @param {string} props.searchTerm
 * @param {(value: string) => void} props.onSearchChange
 * @param {(student: object) => void} props.onEdit
 * @param {(id: string) => void} props.onDelete
 * @param {string|null} props.editingId
 */
function StudentList({ students, searchTerm, onSearchChange, onEdit, onDelete, editingId }) {
  return (
    <div className="student-list">
      <div className="student-list__toolbar">
        <input
          type="text"
          className="student-list__search"
          placeholder="Search by name or roll number…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search students"
        />
      </div>

      {students.length === 0 ? (
        <div className="student-list__empty">
          <span>🗂️</span>
          <p>No students match yet. Add one using the form.</p>
        </div>
      ) : (
        <div className="student-list__table-wrap">
          <table className="student-list__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roll No.</th>
                <th>Course</th>
                <th>Year</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={student.id === editingId ? 'is-editing' : ''}
                >
                  <td>{student.name}</td>
                  <td className="student-list__email">{student.email}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.course}</td>
                  <td>
                    <span className="student-list__year">{student.year}</span>
                  </td>
                  <td className="student-list__actions">
                    <button type="button" onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="student-list__delete"
                      onClick={() => onDelete(student.id)}
                      aria-label={`Delete ${student.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default StudentList
