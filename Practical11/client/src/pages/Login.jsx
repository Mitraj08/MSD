import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { errorMessage } from '../api.js';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card narrow form" onSubmit={submit}>
      <h1>Log in</h1>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
      </div>
      {error && <p className="notice error" role="alert">{error}</p>}
      <button type="submit" className="btn" disabled={busy}>
        {busy ? 'Logging in...' : 'Log in'}
      </button>
      <p className="hint">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
