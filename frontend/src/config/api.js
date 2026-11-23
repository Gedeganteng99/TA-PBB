import axios from 'axios';
import { authService } from '../services/authService.js';

// Empty base URL uses same-origin /api rewrites in the Vercel multi-service deployment.
// Set VITE_API_BASE_URL=http://localhost:3001 for separate local dev servers.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/login')) authService.logout();
    if (!error.response) {
      // Network error / offline
      return Promise.reject(new Error('Tidak ada koneksi internet. Data mungkin dari cache.'));
    }
    const msg = error.response?.data?.message || `Error ${error.response?.status}`;
    return Promise.reject(new Error(msg));
  }
);

export default api;
