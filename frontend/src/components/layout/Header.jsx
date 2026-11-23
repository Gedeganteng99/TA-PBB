import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites.js';

export default function Header() {
  const { favIds } = useFavorites();

  return (
    <header className="header" role="banner">
      <Link to="/" className="header-logo" aria-label="NgopiKampus Home">
        <span>☕</span>
        NgopiKampus
      </Link>
      <div className="header-actions">
        <Link
          to="/favorit"
          className="icon-btn"
          aria-label={`Favorit (${favIds.length} item)`}
          id="header-favorite-btn"
          style={{ position: 'relative' }}
        >
          <Heart size={22} />
          {favIds.length > 0 && (
            <span style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {favIds.length > 9 ? '9+' : favIds.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
