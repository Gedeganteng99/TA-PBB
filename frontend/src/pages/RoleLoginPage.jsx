import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, UserRound, LogIn, UserPlus } from 'lucide-react';
import { authService } from '../services/authService.js';

export default function RoleLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/daftar';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authService.role()) return <Navigate to={authService.isAdmin() ? '/kelola' : '/'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (isRegister && password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) await authService.register({ name, email, password });
      else await authService.loginUser(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || (isRegister ? 'Pendaftaran gagal. Coba lagi.' : 'Email atau password salah'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="role-login-screen">
      <section className="role-login-card" aria-labelledby="role-login-title">
        <div className="role-modal-mark"><Coffee size={28} /></div>
        <p className="admin-eyebrow">NGOPIKAMPUS · PENGGUNA</p>
        <h1 id="role-login-title">{isRegister ? 'Buat akun' : 'Selamat datang'}</h1>
        <p className="role-modal-description">{isRegister ? 'Daftar untuk menemukan kafe favoritmu.' : 'Masuk untuk melihat dan menyimpan kafe pilihanmu.'}</p>
        <form className="admin-login-form user-auth-form" onSubmit={submit}>
          {isRegister && <label className="admin-field"><span>Nama</span><input className="form-input" type="text" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>}
          <label className="admin-field"><span>Email</span><input className="form-input" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="admin-field"><span>Password</span><input className="form-input" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {isRegister && <label className="admin-field"><span>Konfirmasi password</span><input className="form-input" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>}
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-full" disabled={loading}>
            {isRegister ? <UserPlus size={17} /> : <LogIn size={17} />}
            {loading ? 'Memproses…' : isRegister ? 'Daftar sebagai pengguna' : 'Masuk sebagai pengguna'}
          </button>
        </form>
        <p className="user-auth-switch">
          {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <Link to={isRegister ? '/masuk' : '/daftar'}>{isRegister ? 'Masuk' : 'Daftar'}</Link>
        </p>
        <p className="admin-login-note"><UserRound size={14} /> Akun yang didaftarkan memiliki role Pengguna.</p>
      </section>
    </main>
  );
}
