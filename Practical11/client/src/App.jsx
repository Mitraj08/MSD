import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import PostView from './pages/PostView.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PostForm from './pages/PostForm.jsx';
import Users from './pages/Users.jsx';

const WRITERS = ['author', 'admin'];

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={WRITERS}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute roles={WRITERS}>
                <PostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute roles={WRITERS}>
                <PostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
