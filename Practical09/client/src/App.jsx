import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteFile, downloadUrl, errorMessage, listFiles, uploadFiles } from './api.js';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function App() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'error' | 'ok', text }
  const inputRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      setFiles(await listFiles());
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSelected = (list) => {
    const incoming = Array.from(list);
    if (incoming.length === 0) return;
    setNotice(null);
    setSelected((prev) => [...prev, ...incoming].slice(0, 10));
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeSelected = (index) =>
    setSelected((prev) => prev.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (selected.length === 0 || uploading) return;
    setUploading(true);
    setProgress(0);
    setNotice(null);
    try {
      const result = await uploadFiles(selected, setProgress);
      setNotice({
        type: 'ok',
        text: `${result.files.length} file${result.files.length > 1 ? 's' : ''} uploaded.`,
      });
      setSelected([]);
      await refresh();
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.originalName}"? This cannot be undone.`)) return;
    try {
      await deleteFile(file._id);
      setFiles((prev) => prev.filter((f) => f._id !== file._id));
      setNotice({ type: 'ok', text: `Deleted ${file.originalName}.` });
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addSelected(e.dataTransfer.files);
  };

  return (
    <main className="shell">
      <header className="masthead">
        <h1>File Locker</h1>
        <p>Upload files and keep a record of each one.</p>
      </header>

      <section
        className={`dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          multiple
          hidden
          onChange={(e) => addSelected(e.target.files)}
        />
        <p className="dropzone-title">Drop files here</p>
        <p className="dropzone-sub">Up to 10 files, 10 MB each</p>
        <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
          Choose files
        </button>
      </section>

      {selected.length > 0 && (
        <section className="queue" aria-label="Files ready to upload">
          <ul>
            {selected.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span className="name">{f.name}</span>
                <span className="meta">{formatSize(f.size)}</span>
                <button
                  type="button"
                  className="link"
                  onClick={() => removeSelected(i)}
                  disabled={uploading}
                  aria-label={`Remove ${f.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {uploading && (
            <div className="bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress}%` }} />
            </div>
          )}
          <button type="button" className="btn" onClick={handleUpload} disabled={uploading}>
            {uploading ? `Uploading ${progress}%` : `Upload ${selected.length} file${selected.length > 1 ? 's' : ''}`}
          </button>
        </section>
      )}

      {notice && (
        <p className={`notice ${notice.type}`} role="status">
          {notice.text}
        </p>
      )}

      <section className="library">
        <h2>Uploaded files</h2>
        {loading ? (
          <p className="empty">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="empty">Nothing uploaded yet. Drop a file above to start.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f._id}>
                    <td className="name">{f.originalName}</td>
                    <td className="meta">{f.mimeType}</td>
                    <td className="meta">{formatSize(f.size)}</td>
                    <td className="meta">{formatDate(f.uploadedAt)}</td>
                    <td className="actions">
                      <a className="link" href={downloadUrl(f._id)}>
                        Download
                      </a>
                      <button type="button" className="link danger" onClick={() => handleDelete(f)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
