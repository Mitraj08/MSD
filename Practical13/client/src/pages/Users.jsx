import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';
import { formatDate } from '../utils';

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
      setError('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (u, role) => {
    try {
      await api.put(`/users/${u._id}/role`, { role });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete user ${u.name}?`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div>
      <h2>User management</h2>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <div className="card">
          <table className="table">
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
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td className="actions">
                    {u._id !== me._id && (
                      <>
                        <button
                          className="btn btn-small"
                          onClick={() => changeRole(u, u.role === 'admin' ? 'user' : 'admin')}
                        >
                          Make {u.role === 'admin' ? 'user' : 'admin'}
                        </button>
                        <button className="btn btn-small btn-danger" onClick={() => remove(u)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
