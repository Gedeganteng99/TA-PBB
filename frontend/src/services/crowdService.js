import api from '../config/api.js';

export const crowdService = {
  getStatus: (cafeId) => api.get(`/api/cafes/${cafeId}/crowd`),
  report: (cafeId, data) => api.post(`/api/cafes/${cafeId}/crowd`, data),
};
