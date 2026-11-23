import { Link } from 'react-router-dom';
import { Calendar, IdCard, Clock } from 'lucide-react';
import { formatDate, countdownTo } from '../../utils/timeUtils.js';

export default function PromoCard({ promo }) {
  const remaining = countdownTo(promo.valid_until);
  const isExpired = !remaining;

  return (
    <Link
      to={`/promo/${promo.id}`}
      className="promo-card"
      id={`promo-card-${promo.id}`}
      style={{ display: 'block', textDecoration: 'none', opacity: isExpired ? 0.5 : 1 }}
      aria-label={`Promo: ${promo.title}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
        <div>
          {promo.requires_ktm && (
            <span className="promo-ktm-badge" style={{ marginBottom: 6, display: 'inline-flex' }}>
              <IdCard size={10} />
              KTM
            </span>
          )}
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)' }}>
            {promo.title}
          </h3>
        </div>
      </div>

      {promo.description && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', lineClamp: 2 }}>
          {promo.description}
        </p>
      )}

      {promo.cafes && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
          📍 {promo.cafes.name}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          <Calendar size={12} />
          <span>s/d {formatDate(promo.valid_until)}</span>
        </div>
        {remaining && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-warning)' }}>
            <Clock size={12} />
            <span>{remaining}</span>
          </div>
        )}
        {isExpired && (
          <span className="badge badge-error">Kedaluwarsa</span>
        )}
      </div>
    </Link>
  );
}
