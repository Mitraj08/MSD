import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import api, { errorMessage, formatDate } from '../api.js';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/posts/manage');
      setPosts(res.data.posts);
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/posts/${post._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      setNotice({ type: 'ok', text: `Deleted "${post.title}".` });
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <div className="stack">
      <div className="toolbar">
        <h1>{isAdmin ? 'All posts' : 'My posts'}</h1>
        <Link to="/new" className="btn">
          Write a post
        </Link>
      </div>

      {notice && <p className={`notice ${notice.type}`}>{notice.text}</p>}
      {loading && <p className="empty">Loading posts...</p>}
      {!loading && posts.length === 0 && (
        <p className="empty">You have not written anything yet. Start with Write a post.</p>
      )}

      {posts.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                {isAdmin && <th>Author</th>}
                <th>Status</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td className="strong">
                    <Link to={`/posts/${p._id}`}>{p.title}</Link>
                  </td>
                  {isAdmin && <td>{p.author?.name || 'Unknown'}</td>}
                  <td>
                    <span className={`badge ${p.status}`}>{p.status}</span>
                  </td>
                  <td>{formatDate(p.updatedAt)}</td>
                  <td className="actions">
                    <Link to={`/posts/${p._id}/edit`} className="link">
                      Edit
                    </Link>
                    <button type="button" className="link danger" onClick={() => remove(p)}>
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
  );
}
