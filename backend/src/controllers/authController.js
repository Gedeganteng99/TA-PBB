import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createAdminToken, createUserToken } from '../middleware/auth.js';
import supabase from '../config/supabaseClient.js';

const scrypt = promisify(scryptCallback);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeEquals(a = '', b = '') {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && left.length > 0 && timingSafeEqual(left, right);
}

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${hash.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const [algorithm, salt, hashHex] = String(stored || '').split('$');
  if (algorithm !== 'scrypt' || !salt || !/^[a-f\d]{128}$/i.test(hashHex || '')) return false;
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(hashHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function loginRegisteredUser(email, password, res) {
  const { data, error } = await supabase
    .from('app_users')
    .select('id, full_name, email, password_hash, role')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.role !== 'pengguna' || !await verifyPassword(password, data.password_hash)) {
    return res.status(401).json({ success: false, data: null, message: 'Email atau password salah' });
  }
  const token = createUserToken(data.id);
  return res.json({ success: true, data: { token, user: { id: data.id, name: data.full_name, email: data.email, role: 'pengguna' }, expires_in: 28800 }, message: 'Login berhasil.' });
}

// One login endpoint identifies the role from the matching credentials.
export const login = asyncHandler(async (req, res) => {
  const submittedEmail = normalizeEmail(req.body?.email ?? req.body?.username);
  const submittedPassword = req.body?.password;
  if (!EMAIL_PATTERN.test(submittedEmail) || submittedEmail.length > 254 || typeof submittedPassword !== 'string' || submittedPassword.length < 1 || submittedPassword.length > 128) {
    return res.status(401).json({ success: false, data: null, message: 'Email atau password salah' });
  }

  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME);
  if (adminEmail && submittedEmail === adminEmail) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secretReady = process.env.AUTH_TOKEN_SECRET && process.env.AUTH_TOKEN_SECRET.length >= 32;
    if (!adminPassword || !secretReady || !safeEquals(submittedPassword, adminPassword)) {
      return res.status(401).json({ success: false, data: null, message: 'Email atau password salah' });
    }
    const token = createAdminToken(adminEmail);
    return res.json({ success: true, data: { token, user: { email: adminEmail, role: 'admin' }, expires_in: 28800 }, message: 'Login admin berhasil.' });
  }

  return loginRegisteredUser(submittedEmail, submittedPassword, res);
});

export const registerUser = asyncHandler(async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ success: false, data: null, message: 'Nama harus berisi 2 sampai 80 karakter.' });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return res.status(400).json({ success: false, data: null, message: 'Masukkan alamat email yang valid.' });
  }
  const configuredAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME);
  if (configuredAdminEmail && email === configuredAdminEmail) {
    return res.status(409).json({ success: false, data: null, message: 'Email tersebut tidak dapat digunakan untuk pendaftaran.' });
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).json({ success: false, data: null, message: 'Password harus berisi 8 sampai 128 karakter.' });
  }

  const password_hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('app_users')
    .insert({ full_name: name, email, password_hash, role: 'pengguna' })
    .select('id, full_name, email, role')
    .single();

  if (error?.code === '23505') {
    return res.status(409).json({ success: false, data: null, message: 'Email sudah terdaftar. Silakan masuk.' });
  }
  if (error) throw error;

  const token = createUserToken(data.id);
  res.status(201).json({ success: true, data: { token, user: { id: data.id, name: data.full_name, email: data.email, role: 'pengguna' }, expires_in: 28800 }, message: 'Pendaftaran berhasil.' });
});

export const loginUser = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || typeof password !== 'string' || password.length < 1 || password.length > 128) {
    return res.status(400).json({ success: false, data: null, message: 'Email atau password salah' });
  }

  return loginRegisteredUser(email, password, res);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user, message: 'Role pengguna berhasil diperiksa.' });
});
