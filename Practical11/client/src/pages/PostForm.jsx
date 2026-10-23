import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api.js';

export default function PostForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [values, setValues] = useState({ title: '', tags: '', status: 'published', content: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/posts/${id}`)
      .then(({ data }) => {
        if (!data.canEdit) {
          navigate('/', { replace: true });
          return;
        }
        const p = data.post;
        setValues({ title: p.title, tags: p.tags.join(', '), status: p.status, content: p.content });
      })
      .catch((err) => setFormError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, editing, navigate]);

  const change = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (values.title.trim().length < 3) found.title = 'Title must be at least 3 characters.';
    if (values.content.trim().length < 10) found.content = 'Content must be at least 10 characters.';
    if (Object.keys(found).length) return setErrors(found);

    setSaving(true);
    setFormError('');
    const payload = {
      title: values.title.trim(),
      content: values.content,
      status: values.status,
      tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = editing ? await api.put(`/posts/${id}`, payload) : await api.post('/posts', payload);
      navigate(`/posts/${res.data.post._id}`);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty">Loading post...</p>;

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h1>{editing ? 'Edit post' : 'Write a post'}</h1>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" className="input" value={values.title} onChange={change} aria-invalid={Boolean(errors.title)} />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" className="input" rows="12" value={values.content} onChange={change} aria-invalid={Boolean(errors.content)} />
        {errors.content && <span className="field-error">{errors.content}</span>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="tags">Tags (comma separated, up to 5)</label>
          <input id="tags" name="tags" className="input" value={values.tags} onChange={change} placeholder="react, tutorial" />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" className="input" value={values.status} onChange={change}>
            <option value="published">Published</option>
            <option value="draft">Draft (only you and admins see it)</option>
          </select>
        </div>
      </div>

      {formError && <p className="notice error" role="alert">{formError}</p>}

      <div className="actions-row">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Save post'}
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => navigate(-1)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
