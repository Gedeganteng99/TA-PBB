import { Link } from 'react-router-dom';
import { MapPin, Wifi, Zap, Star, Clock, Users } from 'lucide-react';
import { formatRupiah, isOpenNow } from '../../utils/timeUtils.js';
import { formatDistance } from '../../utils/haversine.js';
import { UNDIP_LAT, UNDIP_LNG } from '../../constants/index.js';
import { haversineKm } from '../../utils/haversine.js';
import { useFavorites } from '../../hooks/useFavorites.js';
import { Heart } from 'lucide-react';

export default function CafeCard({ cafe }) {
  const { isFav, toggle } = useFavorites();
  const open = isOpenNow(cafe.open_time, cafe.close_time);
  const dist = haversineKm(UNDIP_LAT, UNDIP_LNG, cafe.latitude, cafe.longitude);
  const fav  = isFav(cafe.id);

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(cafe.id);
  };

  return (
    <Link to={`/kafe/${cafe.id}`} className="card" id={`cafe-card-${cafe.id}`} aria-label={`Kafe ${cafe.name}`}>
      <div style={{ position: 'relative' }}>
        <img
          src={cafe.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'}
          alt={cafe.name}
          className="card-img"
          loading="lazy"
        />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span className={`badge ${open ? 'badge-success' : 'badge-error'}`}>
            <Clock size={10} />
            {open ? 'Buka' : 'Tutup'}
          </span>
        </div>
        <button
          onClick={handleFav}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}
          aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Heart size={18} fill={fav ? 'var(--color-primary)' : 'none'} stroke="var(--color-primary)" />
        </button>

        {/* Study Score badge */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
          borderRadius: 'var(--radius-md)',
          padding: '4px 10px',
          color: '#fff',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>{cafe.study_score ?? '--'}</span>
          <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.9 }}>Study</span>
        </div>
      </div>

      <div className="card-body">
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 4, color: 'var(--color-text)' }}>
          {cafe.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 8 }}>
          <MapPin size={12} />
          <span>{cafe.area}</span>
          <span>·</span>
          <span>{formatDistance(dist)}</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
            <span>{cafe.avg_rating?.toFixed(1) ?? '–'}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>({cafe.review_count ?? 0})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <Wifi size={12} />
            <span>{cafe.wifi_speed_mbps} Mbps</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <Zap size={12} />
            <span>{cafe.outlet_level}/5</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatRupiah(cafe.price_min)} – {formatRupiah(cafe.price_max)}
          </span>
          {cafe.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-primary" style={{ marginLeft: 4, fontSize: '10px' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
