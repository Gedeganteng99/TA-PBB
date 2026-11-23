import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Tag } from 'lucide-react';
import { useCafes } from '../hooks/useCafes.js';
import { usePromos } from '../hooks/usePromos.js';
import CafeCard from '../components/cafe/CafeCard.jsx';
import PromoCard from '../components/promo/PromoCard.jsx';
import LoadingSpinner, { SkeletonCard } from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function HomePage() {
  const { cafes: openCafes, loading: loadingOpen, error: errorOpen } = useCafes({ open_now: 'true', sort: 'study_score', limit: 3 });
  const { cafes: topCafes,  loading: loadingTop,  error: errorTop  } = useCafes({ sort: 'study_score', limit: 3 });
  const { promos, loading: loadingPromo } = usePromos({ active: 'true' });

  const topPromos = promos.slice(0, 2);

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Halo, Mahasiswa! 👋</h1>
        <p className="hero-subtitle">
          Temukan kafe terbaik untuk belajar, skripsi,<br />
          dan kerja kelompok di sekitar Undip Tembalang
        </p>
        <Link to="/cari" className="btn btn-accent btn-sm" id="home-spotfinder-btn">
          <Sparkles size={16} />
          Spot Finder – Carikan Kafe
        </Link>
      </div>

      {/* Buka sekarang & sepi */}
      <section aria-labelledby="open-now-title">
        <div className="section-header">
          <h2 className="section-title" id="open-now-title">🟢 Buka & Sepi Sekarang</h2>
          <Link to="/kafe?open_now=true" className="section-link" id="home-open-link">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        {loadingOpen ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : errorOpen ? (
          <ErrorState message={errorOpen} />
        ) : openCafes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            😴 Tidak ada kafe yang buka sekarang
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {openCafes.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} />)}
          </div>
        )}
      </section>

      <div className="divider" />

      {/* Top Study Score */}
      <section aria-labelledby="top-study-title">
        <div className="section-header">
          <h2 className="section-title" id="top-study-title">
            <TrendingUp size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Top Study Score
          </h2>
          <Link to="/kafe?sort=study_score" className="section-link" id="home-top-link">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        {loadingTop ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : errorTop ? (
          <ErrorState message={errorTop} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {topCafes.map((cafe, i) => (
              <div key={cafe.id} style={{ position: 'relative' }}>
                {i === 0 && (
                  <div style={{ position: 'absolute', top: -8, left: 12, zIndex: 10, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: '11px', fontWeight: 800 }}>
                    🏆 #1 Terbaik
                  </div>
                )}
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="divider" />

      {/* Promo Aktif */}
      {topPromos.length > 0 && (
        <section aria-labelledby="promo-title">
          <div className="section-header">
            <h2 className="section-title" id="promo-title">
              <Tag size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Promo Aktif
            </h2>
            <Link to="/promo" className="section-link" id="home-promo-link">
              Semua promo <ArrowRight size={14} />
            </Link>
          </div>

          {loadingPromo ? (
            <LoadingSpinner />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {topPromos.map((promo) => <PromoCard key={promo.id} promo={promo} />)}
            </div>
          )}
        </section>
      )}

      <div style={{ height: 'var(--space-4)' }} />
    </div>
  );
}
