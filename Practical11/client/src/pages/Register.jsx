import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { errorMessage } from '../api.js';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'reader' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Name must be at least 2 characters.';
    if (form.password.length < 8) found.password = 'Password must be at least 8 characters.';
    if (Object.keys(found).length) return setErrors(found);

    setBusy(true);
    setError('');
    try {
      await register({ ...form, name: form.name.trim() });
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="input" value={form[name]} onChange={change} aria-invalid={Boolean(errors[name])} {...extra} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="card narrow form" onSubmit={submit} noValidate>
      <h1>Create an account</h1>
      {field('name', 'Full name', 'text', { autoComplete: 'name' })}
      {field('email', 'Email', 'email', { autoComplete: 'username' })}
      {field('password', 'Password (8+ characters)', 'password', { autoComplete: 'new-password' })}

      <fieldset className="field roles">
        <legend>I want to</legend>
        <label>
          <input type="radio" name="role" value="reader" checked={form.role === 'reader'} onChange={change} />
          Read posts
        </label>
        <label>
          <input type="radio" name="role" value="author" checked={form.role === 'author'} onChange={change} />
          Write and publish posts
        </label>
      </fieldset>

      {error && <p className="notice error" role="alert">{error}</p>}
      <button type="submit" className="btn" disabled={busy}>
        {busy ? 'Creating account...' : 'Sign up'}
      </button>
      <p className="hint">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
