import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';
import DocFormModal from '../components/DocFormModal.jsx';
import ShareModal from '../components/ShareModal.jsx';
import VersionsModal from '../components/VersionsModal.jsx';
import { CATEGORIES, downloadFile, formatDate, formatSize } from '../utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('');
  const [scope, setScope] = useState('all');

  const [formDoc, setFormDoc] = useState(undefined); // undefined=closed, null=new, object=edit
  const [shareDoc, setShareDoc] = useState(null);
  const [versionDoc, setVersionDoc] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, s] = await Promise.all([
        api.get('/documents', { params: { search: debounced, category, scope } }),
        api.get('/documents/stats'),
      ]);
      setDocs(d.data.documents);
      setStats(s.data);
      setError('');
    } catch (err) {
      setError(errMsg(err, 'Failed to load documents'));
    } finally {
      setLoading(false);
    }
  }, [debounced, category, scope]);

  useEffect(() => {
    load();
  }, [load]);

  const canEdit = (d) => user.role === 'admin' || d.owner?._id === user._id;

  const handleDownload = async (d) => {
    try {
      await downloadFile(d._id, d.originalName);
    } catch (err) {
      setError('Download failed');
    }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete "${d.title}" and all its versions?`)) return;
    try {
      await api.delete(`/documents/${d._id}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const closeForm = () => setFormDoc(undefined);

  return (
    <div>
      <div className="page-head">
        <h2>Documents</h2>
        <button className="btn btn-primary" onClick={() => setFormDoc(null)}>
          + Upload document
        </button>
      </div>

      {stats && (
        <div className="stats">
          <div className="stat">
            <span className="stat-num">{stats.total}</span>
            <span className="muted">Total documents</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.mine}</span>
            <span className="muted">Owned</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.sharedWithMe}</span>
            <span className="muted">Shared / others</span>
          </div>
          <div className="stat">
            <span className="stat-num">{formatSize(stats.totalSize)}</span>
            <span className="muted">Storage used</span>
          </div>
        </div>
      )}

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search title, description, tags, file name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="all">All accessible</option>
          <option value="mine">Owned by me</option>
          <option value="shared">Shared with me</option>
        </select>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card">
        {loading ? (
          <p className="muted center pad">Loading...</p>
        ) : docs.length === 0 ? (
          <p className="muted center pad">No documents found.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Size</th>
                  <th>Ver.</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <div className="doc-title">{d.title}</div>
                      <div className="muted small">{d.originalName}</div>
                      {d.tags.length > 0 && (
                        <div className="tags">
                          {d.tags.map((t) => (
                            <span key={t} className="tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge cat">{d.category}</span>
                    </td>
                    <td>{d.owner?._id === user._id ? 'You' : d.owner?.name}</td>
                    <td>{formatSize(d.size)}</td>
                    <td>v{d.currentVersion}</td>
                    <td className="small">{formatDate(d.updatedAt)}</td>
                    <td className="actions">
                      <button className="btn btn-small" onClick={() => handleDownload(d)}>
                        Download
                      </button>
                      <button className="btn btn-small" onClick={() => setVersionDoc(d)}>
                        Versions
                      </button>
                      {canEdit(d) && (
                        <>
                          <button className="btn btn-small" onClick={() => setShareDoc(d)}>
                            Share
                          </button>
                          <button className="btn btn-small" onClick={() => setFormDoc(d)}>
                            Edit
                          </button>
                          <button className="btn btn-small btn-danger" onClick={() => handleDelete(d)}>
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

      {formDoc !== undefined && (
        <DocFormModal
          doc={formDoc}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            load();
          }}
        />
      )}
      {shareDoc && (
        <ShareModal doc={shareDoc} onClose={() => setShareDoc(null)} onChanged={load} />
      )}
      {versionDoc && (
        <VersionsModal
          doc={versionDoc}
          canEdit={canEdit(versionDoc)}
          onClose={() => setVersionDoc(null)}
          onChanged={load}
        />
      )}
    </div>
  );
}
