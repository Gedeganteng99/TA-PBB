import api from '../config/api.js';

const TOKEN_KEY = 'ngopikampus_admin_token';
const ROLE_KEY = 'ngopikampus_role';
const LEGACY_ROLE_KEY = 'ngopikampus_session_role';

function tokenPayload() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp * 1000 <= Date.now() || payload.role !== 'admin') {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return payload;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, response.data.data.token);
    localStorage.removeItem(ROLE_KEY);
    return response;
  },
  logout: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(ROLE_KEY); sessionStorage.removeItem(LEGACY_ROLE_KEY); },
  loginAsUser: () => { localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(LEGACY_ROLE_KEY); localStorage.setItem(ROLE_KEY, 'pengguna'); },
  selectAdmin: () => { localStorage.removeItem(ROLE_KEY); sessionStorage.removeItem(LEGACY_ROLE_KEY); },
  getToken: () => tokenPayload() ? localStorage.getItem(TOKEN_KEY) : null,
  isAdmin: () => Boolean(tokenPayload()),
  role: () => tokenPayload()?.role || (localStorage.getItem(ROLE_KEY) === 'pengguna' ? 'pengguna' : null),
};
