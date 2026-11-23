import api from '../config/api.js';

export const promoService = {
  getAll: (params) => api.get('/api/promos', { params }),
  getById: (id) => api.get(`/api/promos/${id}`),
  create: (data) => api.post('/api/promos', data),
  update: (id, data) => api.put(`/api/promos/${id}`, data),
  delete: (id) => api.delete(`/api/promos/${id}`),
};
