import { useState } from "react";
import { api } from "../api";
import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";
import { Card, EmptyState, ErrorBox, Loader } from "../components/UI";

const emptyForm = { name: "", email: "" };

export default function Users() {
  const notify = useToast();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const { data: users, loading, error, reload } = useFetch(() => api.getUsers(debounced), [debounced]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.addUser(form);
      setForm(emptyForm);
      notify("User added");
      reload();
    } catch (err) { notify(err.message, "error"); }
  };

  const startEdit = (u) => { setEditingId(u.id); setEditForm({ name: u.name, email: u.email }); };

  const saveEdit = async (id) => {
    try {
      await api.updateUser(id, editForm);
      setEditingId(null);
      notify("User updated");
      reload();
    } catch (err) { notify(err.message, "error"); }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    try {
      await api.deleteUser(u.id);
      notify("User deleted");
      reload();
    } catch (err) { notify(err.message, "error"); }
  };

  return (
    <>
      <h1>Users</h1>

      <Card title="Add user" hint="POST /api/users (validated by route middleware)">
        <form className="row" onSubmit={add}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button type="submit">Add</button>
        </form>
        <p className="note">Submit it empty to see the 400 validation error from the middleware.</p>
      </Card>

      <Card title="All users" hint="GET /api/users?search=">
        <input className="wide" placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {loading && <Loader />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {!loading && !error && users && users.length === 0 && <EmptyState text="No users found." />}
        <ul className="list">
          {users && users.map((u) => (
            <li key={u.id}>
              {editingId === u.id ? (
                <>
                  <div className="row grow">
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                  <div className="row">
                    <button onClick={() => saveEdit(u.id)}>Save</button>
                    <button className="ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grow">
                    <div className="avatar">{u.name.charAt(0).toUpperCase()}</div>
                    <div><strong>{u.name}</strong><br /><span className="muted">{u.email}</span></div>
                  </div>
                  <div className="row">
                    <button className="ghost" onClick={() => startEdit(u)}>Edit</button>
                    <button className="danger" onClick={() => remove(u)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
