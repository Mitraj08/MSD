import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const errorMessage = (err) =>
  err.response?.data?.message ||
  (err.request ? 'Cannot reach the server. Is the backend running on port 5000?' : err.message);

export const listFiles = () => api.get('/files').then((r) => r.data);

export const uploadFiles = (files, onProgress) => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  return api
    .post('/files', form, {
      onUploadProgress: (e) => {
        if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    })
    .then((r) => r.data);
};

export const deleteFile = (id) => api.delete(`/files/${id}`).then((r) => r.data);

export const downloadUrl = (id) => `/api/files/${id}/download`;
