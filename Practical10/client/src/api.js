import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const errorMessage = (err) =>
  err.response?.data?.message ||
  (err.request ? 'Cannot reach the server. Is the backend running on port 5000?' : err.message);

export const getStudents = (params) => api.get('/students', { params }).then((r) => r.data);
export const createStudent = (data) => api.post('/students', data).then((r) => r.data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data).then((r) => r.data);
export const removeStudent = (id) => api.delete(`/students/${id}`).then((r) => r.data);
