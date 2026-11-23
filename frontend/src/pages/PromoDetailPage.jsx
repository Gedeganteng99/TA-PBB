import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, IdCard, Clock, ExternalLink } from 'lucide-react';
import { promoService } from '../services/promoService.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { formatDate, countdownTo } from '../utils/timeUtils.js';

export default function PromoDetailPage() {
  const { id } = useParams();
  const [promo, setPromo]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchPromo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await promoService.getById(id);
      setPromo(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromo(); }, [id]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorState message={error} onRetry={fetchPromo} />;
  if (!promo)  return null;

  const remaining = countdownTo(promo.valid_until);
  const isExpired = !remaining;

  return (
    <div className="page-container">
      <Link to="/promo" className="btn btn-secondary btn-sm" id="promo-detail-back-btn" aria-label="Kembali ke daftar promo" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Kembali
      </Link>

      {/* Header promo */}
      <div style={{
        background: isExpired
          ? 'var(--color-bg-secondary)'
          : 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        color: isExpired ? 'var(--color-text)' : '#fff',
        marginBottom: 'var(--space-5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: '8rem', opacity: 0.07 }}>%</div>

        {promo.requires_ktm && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            <IdCard size={12} /> Butuh KTM Undip
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)', lineHeight: 1.2 }}>
          {promo.title}
        </h1>

        {promo.description && (
          <p style={{ opacity: 0.9, fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
            {promo.description}
          </p>
        )}

        {remaining ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 700 }}>
            <Clock size={16} />
            Berakhir dalam: {remaining}
          </div>
        ) : (
          <span style={{ background: 'var(--color-error)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
            Promo Kedaluwarsa
          </span>
        )}
      </div>

      {/* Detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
            <Calendar size={12} /> Masa Berlaku
          </div>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
            {formatDate(promo.valid_from)} – {formatDate(promo.valid_until)}
          </p>
        </div>

        {promo.terms && (
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>
              📋 Syarat & Ketentuan
            </p>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{promo.terms}</p>
          </div>
        )}

        {/* Link ke kafe */}
        {promo.cafes && (
          <Link
            to={`/kafe/${promo.cafes.id}`}
            className="btn btn-primary btn-full"
            id="promo-cafe-link"
          >
            <ExternalLink size={16} />
            Lihat Kafe: {promo.cafes.name}
          </Link>
        )}
      </div>
    </div>
  );
}
