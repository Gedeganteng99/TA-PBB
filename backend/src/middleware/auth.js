import { createHmac, timingSafeEqual } from 'node:crypto';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const signature = (value, secret) => createHmac('sha256', secret).update(value).digest('base64url');

export function createAdminToken(username) {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_TOKEN_SECRET harus diisi dengan minimal 32 karakter');
  const payload = encode({ sub: username, role: 'admin', exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60 });
  const body = `${encode({ alg: 'HS256', typ: 'JWT' })}.${payload}`;
  return `${body}.${signature(body, secret)}`;
}

function verifyAdminToken(token) {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || secret.length < 32) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const body = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(signature(body, secret));
  const supplied = Buffer.from(parts[2]);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (payload.role !== 'admin' || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return { username: payload.sub, role: 'admin' };
  } catch {
    return null;
  }
}

export function identifyRole(req, _res, next) {
  req.user = { role: 'pengguna' };
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme?.toLowerCase() === 'bearer' && token) {
    const user = verifyAdminToken(token);
    if (user) req.user = user;
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, data: null, message: 'Akses khusus admin. Silakan login sebagai admin.' });
  }
  next();
}
