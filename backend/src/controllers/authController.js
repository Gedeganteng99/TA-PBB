import { timingSafeEqual } from 'node:crypto';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createAdminToken } from '../middleware/auth.js';

function safeEquals(a = '', b = '') {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && left.length > 0 && timingSafeEqual(left, right);
}

export const login = asyncHandler(async (req, res) => {
  const email = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || !process.env.AUTH_TOKEN_SECRET) {
    return res.status(500).json({ success: false, data: null, message: 'Konfigurasi admin belum disiapkan di environment backend.' });
  }
  const submittedEmail = String(req.body?.email ?? req.body?.username ?? '').trim().toLowerCase();
  if (!safeEquals(submittedEmail, email.trim().toLowerCase()) || !safeEquals(req.body?.password, password)) {
    return res.status(401).json({ success: false, data: null, message: 'Email atau password admin salah.' });
  }
  const token = createAdminToken(email);
  res.json({ success: true, data: { token, user: { email, role: 'admin' }, expires_in: 28800 }, message: 'Login admin berhasil.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user, message: 'Role pengguna berhasil diperiksa.' });
});
