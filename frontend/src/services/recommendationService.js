import api from '../config/api.js';

export const recommendationService = {
  get: (body) => api.post('/api/recommendations', body),
};
