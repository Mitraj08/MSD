import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import api, { errorMessage, formatDate } from '../api.js';

const ROLES = ['reader', 'author', 'admin'];

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    try {
      setUsers((await api.get('/users')).data.users);
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (u, role) => {
    try {
      const res = await api.patch(`/users/${u._id}/role`, { role });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? res.data.user : x)));
      setNotice({ type: 'ok', text: `${u.name} is now ${role}.` });
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name} and all of their posts? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
      setNotice({ type: 'ok', text: `Deleted ${u.name} and their posts.` });
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <div className="stack">
      <h1>Users</h1>
      {notice && <p className={`notice ${notice.type}`}>{notice.text}</p>}
      {loading && <p className="empty">Loading users...</p>}
      {users.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u._id === me._id;
                return (
                  <tr key={u._id}>
                    <td className="strong">
                      {u.name}
                      {isMe && <span className="sub"> (you)</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="input compact"
                        value={u.role}
                        disabled={isMe}
                        onChange={(e) => changeRole(u, e.target.value)}
                        aria-label={`Role for ${u.name}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td className="actions">
                      <button type="button" className="link danger" disabled={isMe} onClick={() => remove(u)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
