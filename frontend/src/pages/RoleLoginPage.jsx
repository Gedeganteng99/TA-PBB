import { useNavigate } from 'react-router-dom';
import { Coffee, KeyRound, ShieldCheck, UserRound } from 'lucide-react';
import { authService } from '../services/authService.js';

export default function RoleLoginPage() {
  const navigate = useNavigate();
  const chooseUser = () => {
    authService.loginAsUser();
    navigate('/', { replace: true });
  };

  return (
    <main className="role-login-screen">
      <section className="role-login-card" aria-labelledby="role-login-title">
        <div className="role-modal-mark"><Coffee size={28} /></div>
        <p className="admin-eyebrow">NGOPIKAMPUS</p>
        <h1 id="role-login-title">Selamat datang</h1>
        <p className="role-modal-description">Pilih metode masuk untuk melanjutkan.</p>
        <button className="role-option role-option-user" onClick={chooseUser}>
          <span className="role-option-icon"><UserRound size={22} /></span>
          <span><strong>Masuk sebagai Pengguna</strong><small>Langsung lihat daftar kafe. Tidak perlu akun.</small></span>
        </button>
        <button className="role-option role-option-admin" onClick={() => { authService.selectAdmin(); navigate('/admin/login'); }}>
          <span className="role-option-icon"><ShieldCheck size={22} /></span>
          <span><strong>Admin · Email &amp; Password</strong><small>Login untuk mengelola data kafe dan promo.</small></span>
          <KeyRound size={18} className="role-option-trailing" />
        </button>
        <p className="role-modal-footnote">Anda harus memilih salah satu role sebelum menggunakan aplikasi.</p>
      </section>
    </main>
  );
}
