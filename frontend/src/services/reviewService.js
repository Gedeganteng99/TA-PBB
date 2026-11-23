import api from '../config/api.js';

export const reviewService = {
  getByCafe: (cafeId) => api.get(`/api/cafes/${cafeId}/reviews`),
  create: (cafeId, data) => api.post(`/api/cafes/${cafeId}/reviews`, data),
  delete: (reviewId) => api.delete(`/api/reviews/${reviewId}`),
};
