import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authService.isAdmin()) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await authService.login(email, password); navigate('/', { replace: true }); }
    catch (err) { setError(err.message || 'Login gagal. Periksa email dan password admin.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container admin-login-page">
      <Link to="/masuk" className="btn btn-secondary btn-sm"><ArrowLeft size={16} /> Pilih role</Link>
      <section className="admin-login-card">
        <div className="admin-login-icon"><KeyRound size={26} /></div>
        <p className="admin-eyebrow">AREA ADMIN</p>
        <h1 className="page-title">Masuk Admin</h1>
        <p className="page-subtitle">Login untuk mengelola data kafe dan promo.</p>
        <form className="admin-login-form" onSubmit={submit}>
          <label className="admin-field"><span>Email admin</span><input className="form-input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="admin-field"><span>Password</span><input className="form-input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-full" disabled={loading}><LogIn size={17} />{loading ? 'Memeriksa…' : 'Masuk sebagai admin'}</button>
        </form>
        <p className="admin-login-note">Pengguna umum dapat masuk dari halaman pilihan role. Akses perubahan data hanya untuk admin.</p>
      </section>
    </div>
  );
}
