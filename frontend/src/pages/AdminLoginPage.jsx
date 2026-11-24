import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, LogIn } from 'lucide-react';
import { authService } from '../services/authService.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await authService.login(email, password); navigate('/kelola', { replace: true }); }
    catch (err) { setError(err.message || 'Email atau password salah'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container admin-login-page">
      <Link to="/masuk" className="btn btn-secondary btn-sm"><ArrowLeft size={16} /> Kembali</Link>
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
        <p className="admin-login-note">Halaman khusus pengelola NgopiKampus.</p>
      </section>
    </div>
  );
}
