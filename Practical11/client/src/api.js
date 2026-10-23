import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If a logged-in session expires, clear it and tell the app
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginCall = err.config?.url?.includes('/auth/login');
    if (err.response?.status === 401 && localStorage.getItem('token') && !isLoginCall) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(err);
  }
);

export const errorMessage = (err) =>
  err.response?.data?.message ||
  (err.request ? 'Cannot reach the server. Is the backend running on port 5000?' : err.message);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default api;
