import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – log requests in dev
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error / offline
      return Promise.reject(new Error('Tidak ada koneksi internet. Data mungkin dari cache.'));
    }
    const msg = error.response?.data?.message || `Error ${error.response?.status}`;
    return Promise.reject(new Error(msg));
  }
);

export default api;
