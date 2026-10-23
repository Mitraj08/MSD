import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="empty">Checking your session...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card narrow">
        <h1>No access</h1>
        <p>Your account role ({user.role}) cannot open this page.</p>
      </div>
    );
  }
  return children;
}
