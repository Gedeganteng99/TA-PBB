import api from '../config/api.js';

export const cafeService = {
  getAll: (params) => api.get('/api/cafes', { params }),
  getById: (id) => api.get(`/api/cafes/${id}`),
  uploadImage: (file) => api.post('/api/cafes/upload-image', file, { headers: { 'Content-Type': file.type } }),
  create: (data) => api.post('/api/cafes', data),
  update: (id, data) => api.put(`/api/cafes/${id}`, data),
  delete: (id) => api.delete(`/api/cafes/${id}`),
};
