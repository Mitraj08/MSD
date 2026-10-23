import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const canWrite = user && (user.role === 'author' || user.role === 'admin');

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Margin Notes
        </Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>
            Posts
          </NavLink>
          {canWrite && <NavLink to="/dashboard">Dashboard</NavLink>}
          {canWrite && <NavLink to="/new">Write</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/users">Users</NavLink>}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <span className="who">
                {user.name} <span className={`role role-${user.role}`}>{user.role}</span>
              </span>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-quiet">
                Log in
              </Link>
              <Link to="/register" className="btn">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
