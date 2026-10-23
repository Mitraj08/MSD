import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage, formatDate } from '../api.js';

export default function Home() {
  const [data, setData] = useState({ posts: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/posts', { params: { page, search: query, tag } });
      setData(res.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query, tag]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="stack">
      <div className="toolbar">
        <h1>Latest posts</h1>
        <input
          type="search"
          className="input search"
          placeholder="Search posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search posts"
        />
      </div>

      {tag && (
        <p className="filter">
          Showing posts tagged <strong>{tag}</strong>{' '}
          <button
            type="button"
            className="link"
            onClick={() => {
              setTag('');
              setPage(1);
            }}
          >
            Clear filter
          </button>
        </p>
      )}

      {error && <p className="notice error">{error}</p>}
      {loading && data.posts.length === 0 && <p className="empty">Loading posts...</p>}
      {!loading && !error && data.posts.length === 0 && (
        <p className="empty">No posts found. Try a different search.</p>
      )}

      {data.posts.map((p) => (
        <article key={p._id} className="card post-card">
          <h2>
            <Link to={`/posts/${p._id}`}>{p.title}</Link>
          </h2>
          <p className="meta">
            {p.author?.name || 'Unknown'} on {formatDate(p.createdAt)}
          </p>
          <p className="excerpt">{p.excerpt}</p>
          {p.tags.length > 0 && (
            <div className="tags">
              {p.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="tag"
                  onClick={() => {
                    setTag(t);
                    setPage(1);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </article>
      ))}

      {data.pages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button type="button" className="btn btn-quiet" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {data.pages}
          </span>
          <button type="button" className="btn btn-quiet" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
