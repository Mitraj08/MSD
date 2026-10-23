import { useCallback, useEffect, useState } from 'react';
import { createStudent, errorMessage, getStudents, removeStudent, updateStudent } from './api.js';
import StudentForm from './components/StudentForm.jsx';
import StudentTable from './components/StudentTable.jsx';

const PAGE_SIZE = 5;

export default function App() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null); // { type: 'ok' | 'error', text }

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents({ page, limit: PAGE_SIZE, search: query });
      setStudents(data.students);
      setTotal(data.total);
      setPages(data.pages);
      if (page > data.pages) setPage(data.pages);
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data) => {
    if (editing) {
      await updateStudent(editing._id, data);
      setNotice({ type: 'ok', text: `Saved changes to ${data.name}.` });
      setEditing(null);
      await load();
    } else {
      await createStudent(data);
      setNotice({ type: 'ok', text: `Added ${data.name}.` });
      if (page !== 1) setPage(1);
      else await load();
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await removeStudent(student._id);
      setNotice({ type: 'ok', text: `Deleted ${student.name}.` });
      if (editing?._id === student._id) setEditing(null);
      if (students.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <div className="shell">
      <header className="masthead">
        <h1>Student Register</h1>
        <p>
          {total} student{total === 1 ? '' : 's'} on record
          {query ? ` matching "${query}"` : ''}
        </p>
      </header>

      {notice && (
        <p className={`notice ${notice.type}`} role="status">
          {notice.text}
          <button type="button" className="link" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </p>
      )}

      <div className="layout">
        <StudentForm editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

        <section className="panel list">
          <div className="list-head">
            <h2>Students</h2>
            <input
              type="search"
              className="search"
              placeholder="Search name, email or course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search students"
            />
          </div>

          <StudentTable
            students={students}
            loading={loading}
            editingId={editing?._id}
            onEdit={(s) => {
              setEditing(s);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDelete}
          />

          {pages > 1 && (
            <nav className="pager" aria-label="Pagination">
              <button type="button" className="btn btn-quiet" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                Previous
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button type="button" className="btn btn-quiet" onClick={() => setPage(page + 1)} disabled={page >= pages}>
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
