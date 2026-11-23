import { useFavorites } from '../hooks/useFavorites.js';
import CafeCard from '../components/cafe/CafeCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { favCafes, loading, reload } = useFavorites();

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(111,78,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={22} fill="var(--color-primary)" stroke="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', lineHeight: 1 }}>Favorit</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{favCafes.length} kafe tersimpan</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : favCafes.length === 0 ? (
        <EmptyState
          title="Belum ada favorit"
          description="Tekan ikon hati di kartu kafe untuk menyimpan kafe favoritmu"
          icon={<Heart size={48} strokeWidth={1.5} />}
        >
          <Link to="/kafe" className="btn btn-primary mt-4" id="fav-browse-btn" style={{ marginTop: 16 }}>
            Jelajahi Kafe
          </Link>
        </EmptyState>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {favCafes.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} />)}
        </div>
      )}
    </div>
  );
}
