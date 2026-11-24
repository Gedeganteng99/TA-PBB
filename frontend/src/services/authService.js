import api from '../config/api.js';

const TOKEN_KEY = 'ngopikampus_session_token';
const LEGACY_TOKEN_KEY = 'ngopikampus_admin_token';

function tokenPayload() {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp * 1000 <= Date.now() || !['admin', 'pengguna'].includes(payload.role)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      return null;
    }
    return payload;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    return null;
  }
}

function saveSession(response) {
  localStorage.setItem(TOKEN_KEY, response.data.data.token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  return response;
}

export const authService = {
  login: async (email, password) => saveSession(await api.post('/api/auth/login', { email, password })),
  loginUser: async (email, password) => saveSession(await api.post('/api/auth/user/login', { email, password })),
  register: async ({ name, email, password }) => saveSession(await api.post('/api/auth/user/register', { name, email, password })),
  logout: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(LEGACY_TOKEN_KEY); localStorage.removeItem('ngopikampus_role'); sessionStorage.removeItem('ngopikampus_session_role'); },
  getToken: () => tokenPayload() ? (localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY)) : null,
  isAdmin: () => tokenPayload()?.role === 'admin',
  role: () => tokenPayload()?.role || null,
};
