import { useState } from 'react';
import Modal from './Modal.jsx';
import api, { errMsg } from '../api';

export default function ShareModal({ doc, onClose, onChanged }) {
  const [current, setCurrent] = useState(doc);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/documents/${current._id}/share`, { email });
      setCurrent(data.document);
      setEmail('');
      onChanged();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (userId) => {
    setError('');
    try {
      const { data } = await api.delete(`/documents/${current._id}/share/${userId}`);
      setCurrent(data.document);
      onChanged();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <Modal title={`Share "${current.title}"`} onClose={onClose}>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={add} className="inline-form">
        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary" disabled={busy}>
          Share
        </button>
      </form>

      <h4>Shared with</h4>
      {current.sharedWith.length === 0 ? (
        <p className="muted">Not shared with anyone yet.</p>
      ) : (
        <ul className="plain-list">
          {current.sharedWith.map((u) => (
            <li key={u._id}>
              <span>
                {u.name} <span className="muted">({u.email})</span>
              </span>
              <button className="btn btn-small btn-danger" onClick={() => remove(u._id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
