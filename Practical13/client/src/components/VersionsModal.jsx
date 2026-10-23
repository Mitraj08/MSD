import { useState } from 'react';
import Modal from './Modal.jsx';
import api, { errMsg } from '../api';
import { downloadFile, formatDate, formatSize } from '../utils';

export default function VersionsModal({ doc, canEdit, onClose, onChanged }) {
  const [current, setCurrent] = useState(doc);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const upload = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Choose a file first');
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post(`/documents/${current._id}/version`, fd);
      setCurrent(data.document);
      setFile(null);
      e.target.reset();
      onChanged();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const download = async (v) => {
    try {
      await downloadFile(current._id, v.originalName, v.version);
    } catch (err) {
      setError('Download failed');
    }
  };

  const versions = [...current.versions].sort((a, b) => b.version - a.version);

  return (
    <Modal title={`Versions - ${current.title}`} onClose={onClose} wide>
      {error && <div className="alert error">{error}</div>}

      {canEdit && (
        <form onSubmit={upload} className="inline-form">
          <input type="file" onChange={(e) => setFile(e.target.files[0] || null)} />
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Uploading...' : 'Upload new version'}
          </button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Version</th>
            <th>File</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => (
            <tr key={v.version}>
              <td>
                v{v.version}
                {v.version === current.currentVersion && <span className="badge admin">latest</span>}
              </td>
              <td>{v.originalName}</td>
              <td>{formatSize(v.size)}</td>
              <td>{formatDate(v.uploadedAt)}</td>
              <td>
                <button className="btn btn-small" onClick={() => download(v)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
