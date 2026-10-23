import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          DocVault
        </Link>
        <nav className="nav-links">
          {user && <Link to="/">Documents</Link>}
          {user && user.role === 'admin' && <Link to="/users">Users</Link>}
        </nav>
        <div className="nav-right">
          {user ? (
            <>
              <span className="user-chip">
                {user.name} <span className={`badge ${user.role}`}>{user.role}</span>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
