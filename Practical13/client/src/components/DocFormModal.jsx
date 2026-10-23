import { useState } from 'react';
import Modal from './Modal.jsx';
import api, { errMsg } from '../api';
import { CATEGORIES } from '../utils';

export default function DocFormModal({ doc, onClose, onSaved }) {
  const editing = Boolean(doc);
  const [title, setTitle] = useState(doc?.title || '');
  const [description, setDescription] = useState(doc?.description || '');
  const [category, setCategory] = useState(doc?.category || 'General');
  const [tags, setTags] = useState((doc?.tags || []).join(', '));
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!editing && !file) {
      setError('Please choose a file');
      return;
    }
    if (editing && !title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/documents/${doc._id}`, { title, description, category, tags });
      } else {
        const fd = new FormData();
        fd.append('title', title);
        fd.append('description', description);
        fd.append('category', category);
        fd.append('tags', tags);
        fd.append('file', file);
        await api.post('/documents', fd);
      }
      onSaved();
    } catch (err) {
      setError(errMsg(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={editing ? 'Edit document' : 'Upload document'} onClose={onClose}>
      <form onSubmit={submit} className="form">
        {error && <div className="alert error">{error}</div>}

        {!editing && (
          <label>
            File (max 10 MB)
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.zip"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </label>
        )}

        <label>
          Title
          <input
            type="text"
            value={title}
            maxLength={120}
            placeholder="Defaults to the file name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            rows={3}
            value={description}
            maxLength={1000}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="row">
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tags (comma separated)
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Upload'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
