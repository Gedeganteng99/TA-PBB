import { useState, useEffect } from 'react';
import { Github, Wifi, WifiOff, Info, BookOpen, GraduationCap, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import InstallButton from '../components/ui/InstallButton.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { MAHASISWA, APP_VERSION, GITHUB_URL, STUDY_SCORE_FORMULA } from '../constants/index.js';
import { authService } from '../services/authService.js';

export default function ProfilePage() {
  const isOnline = useOnlineStatus();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    fetch(`${baseUrl}/api/health`)
      .then((r) => (r.ok ? setApiStatus('ok') : setApiStatus('error')))
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 'var(--space-5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: '8rem', opacity: 0.07 }}>☕</div>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3)', fontSize: '2rem' }}>
          <GraduationCap size={36} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', marginBottom: 4 }}>{MAHASISWA.nama}</h1>
        <p style={{ opacity: 0.85, fontSize: 'var(--text-sm)', marginBottom: 2 }}>NIM: {MAHASISWA.nim}</p>
        <p style={{ opacity: 0.75, fontSize: 'var(--text-sm)' }}>Kelompok {MAHASISWA.kelompok} · {MAHASISWA.prodi}</p>
      </div>

      {/* App Info */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: '1.5rem' }}>☕</span>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>NgopiKampus</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>v{APP_VERSION}</p>
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          Katalog kafe ramah mahasiswa di sekitar Undip Tembalang. Membantu mahasiswa menemukan tempat terbaik untuk belajar, mengerjakan skripsi, dan kerja kelompok berdasarkan Study Score yang dihitung secara transparan.
        </p>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            Koneksi
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: isOnline ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <Info size={14} />
            Status API
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: apiStatus === 'ok' ? 'var(--color-success)' : apiStatus === 'error' ? 'var(--color-error)' : 'var(--color-warning)' }}>
            {apiStatus === 'ok' ? '🟢 Online' : apiStatus === 'error' ? '🔴 Error' : '🟡 Memeriksa...'}
          </span>
        </div>
      </div>

      {/* Study Score Formula */}
      <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>📊 Rumus Study Score</h2>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
          Study Score dihitung di backend dari 5 komponen berikut (total max 100):
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {Object.entries(STUDY_SCORE_FORMULA).map(([key, { label, weight, formula }]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{label}</span>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{formula}</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>/{weight}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'rgba(111,78,55,0.08)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: 700 }}>
          study_score = wifi(30) + outlet(20) + noise(25) + seat(10) + rating(15)
        </div>
      </div>

      {/* Install Button */}
      <Link to={authService.isAdmin() ? '/kelola' : '/admin/login'} className="btn btn-primary btn-full" id="profile-manage-data-btn" style={{ marginBottom: 'var(--space-4)' }}>
        <Database size={18} /> {authService.isAdmin() ? 'Kelola Data Kafe & Promo' : 'Login Admin untuk Kelola Data'}
      </Link>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <InstallButton className="btn-full" />
      </div>

      {/* GitHub Link */}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-full"
        id="profile-github-btn"
        aria-label="Lihat source code di GitHub"
        style={{ marginBottom: 'var(--space-4)' }}
      >
        <Github size={18} />
        Source Code di GitHub
      </a>

      {/* PWA Info */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>🔧 Cara Uji PWA</h3>
        <ol style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: 16 }}>
          <li>Buka Chrome DevTools (F12) → Application → Service Workers</li>
          <li>Centang "Offline" untuk menguji mode offline</li>
          <li>Reload halaman – data lama harus tetap tampil</li>
          <li>Tombol "Install Aplikasi" muncul jika browser support</li>
          <li>Gunakan Lighthouse (DevTools) untuk audit PWA</li>
        </ol>
      </div>

      <p style={{ fontSize: '10px', textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
        NgopiKampus v{APP_VERSION} · Praktikum PPB · Teknik Komputer Undip · 2024
      </p>

      <div style={{ height: 'var(--space-6)' }} />
    </div>
  );
}
