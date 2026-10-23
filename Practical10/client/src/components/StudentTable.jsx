export default function StudentTable({ students, loading, editingId, onEdit, onDelete }) {
  if (loading && students.length === 0) return <p className="empty">Loading students...</p>;
  if (students.length === 0) {
    return <p className="empty">No students found. Add one with the form, or change your search.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Contact</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className={s._id === editingId ? 'is-editing' : ''}>
              <td>
                <span className="strong">{s.name}</span>
              </td>
              <td>
                {s.course}
                <span className="sub">Year {s.year}</span>
              </td>
              <td>
                {s.email}
                <span className="sub">{s.phone}</span>
              </td>
              <td className="actions">
                <button type="button" className="link" onClick={() => onEdit(s)}>
                  Edit
                </button>
                <button type="button" className="link danger" onClick={() => onDelete(s)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
