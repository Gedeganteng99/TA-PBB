import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, Wifi, Zap, Users, Star, Wind,
  ExternalLink, Heart, ChevronDown, ChevronUp
} from 'lucide-react';
import { useCafe } from '../hooks/useCafe.js';
import { usePromos } from '../hooks/usePromos.js';
import { useFavorites } from '../hooks/useFavorites.js';
import { reviewService } from '../services/reviewService.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import StudyScoreBar from '../components/cafe/StudyScoreBar.jsx';
import CrowdWidget from '../components/cafe/CrowdWidget.jsx';
import ReviewForm from '../components/cafe/ReviewForm.jsx';
import PromoCard from '../components/promo/PromoCard.jsx';
import { formatRupiah, formatTime, formatDate, isOpenNow } from '../utils/timeUtils.js';
import { UNDIP_LAT, UNDIP_LNG } from '../constants/index.js';
import { haversineKm, formatDistance } from '../utils/haversine.js';

export default function CafeDetailPage() {
  const { id } = useParams();
  const { cafe, loading, error, refetch } = useCafe(id);
  const { promos } = usePromos({ cafe_id: id });
  const { isFav, toggle } = useFavorites();

  const [reviews, setReviews]     = useState([]);
  const [loadRev, setLoadRev]     = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [crowdStatus, setCrowdStatus]       = useState(null);

  useEffect(() => {
    if (cafe) {
      setCrowdStatus(cafe.crowd_status);
      fetchReviews();
    }
  }, [cafe]);

  const fetchReviews = async () => {
    setLoadRev(true);
    try {
      const res = await reviewService.getByCafe(id);
      setReviews(res.data.data ?? []);
    } catch (e) {}
    finally { setLoadRev(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;
  if (!cafe)   return null;

  const open = isOpenNow(cafe.open_time, cafe.close_time);
  const dist = haversineKm(UNDIP_LAT, UNDIP_LNG, cafe.latitude, cafe.longitude);
  const fav  = isFav(cafe.id);
  const mapsUrl = `https://www.google.com/maps?q=${cafe.latitude},${cafe.longitude}`;

  return (
    <div>
      {/* Back button */}
      <div style={{ padding: 'var(--space-3) var(--space-4)', position: 'sticky', top: 'var(--header-height)', zIndex: 50, background: 'var(--color-bg)' }}>
        <Link to="/kafe" className="btn btn-secondary btn-sm" id="cafe-detail-back-btn" aria-label="Kembali ke daftar kafe">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      {/* Hero Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={cafe.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'}
          alt={cafe.name}
          style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
          <button
            onClick={() => toggle(cafe.id)}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
            aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            id="detail-fav-btn"
          >
            <Heart size={20} fill={fav ? 'var(--color-primary)' : 'none'} stroke="var(--color-primary)" />
          </button>
        </div>

        {/* Open/Close badge */}
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <span className={`badge ${open ? 'badge-success' : 'badge-error'}`} style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
            <Clock size={12} />
            {open ? '🟢 Buka Sekarang' : '🔴 Sedang Tutup'}
          </span>
        </div>
      </div>

      <div className="page-container">
        {/* Basic Info */}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>{cafe.name}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            <MapPin size={14} />
            <span>{cafe.area} · {formatDistance(dist)} dari Undip</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
            <span>{cafe.avg_rating?.toFixed(1) ?? '–'} ({cafe.review_count} ulasan)</span>
          </div>
        </div>

        {/* Jam & Harga */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
              <Clock size={12} /> Jam Buka
            </div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{formatTime(cafe.open_time)} – {formatTime(cafe.close_time)} WIB</div>
          </div>
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
              💰 Kisaran Harga
            </div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>
              {formatRupiah(cafe.price_min)} – {formatRupiah(cafe.price_max)}
            </div>
          </div>
        </div>

        {cafe.description && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>
            {cafe.description}
          </p>
        )}

        {/* Fasilitas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <Wifi size={12} /> {cafe.wifi_speed_mbps} Mbps
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <Zap size={12} /> Colokan {cafe.outlet_level}/5
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <Users size={12} /> {cafe.seat_capacity} kursi
          </span>
          {cafe.has_ac && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(37,150,190,0.1)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 600, color: '#2596be' }}>
              <Wind size={12} /> AC
            </span>
          )}
          {cafe.has_musholla && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(45,138,78,0.1)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)' }}>
              🕌 Musholla
            </span>
          )}
        </div>

        <div className="divider" />

        {/* Study Score */}
        <section aria-labelledby="study-score-title" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 id="study-score-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>📊 Study Score</h2>
          <StudyScoreBar score={cafe.study_score} breakdown={cafe.study_score_breakdown} />
        </section>

        <div className="divider" />

        {/* Crowd Widget */}
        <section aria-labelledby="crowd-title" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 id="crowd-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>👥 Kondisi Sekarang</h2>
          <CrowdWidget cafeId={cafe.id} crowdStatus={crowdStatus} onUpdate={() => { refetch(); }} />
        </section>

        <div className="divider" />

        {/* Google Maps */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
            <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {cafe.address}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-full"
            id="cafe-maps-btn"
            aria-label="Buka lokasi kafe di Google Maps"
          >
            <ExternalLink size={16} />
            Buka di Google Maps
          </a>
        </div>

        {/* Promo terkait */}
        {promos.length > 0 && (
          <>
            <div className="divider" />
            <section aria-labelledby="promo-related-title" style={{ marginBottom: 'var(--space-5)' }}>
              <h2 id="promo-related-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>🏷️ Promo Tersedia</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {promos.map((p) => <PromoCard key={p.id} promo={p} />)}
              </div>
            </section>
          </>
        )}

        <div className="divider" />

        {/* Reviews */}
        <section aria-labelledby="reviews-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 id="reviews-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)' }}>⭐ Ulasan ({reviews.length})</h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
              id="toggle-review-form-btn"
              aria-expanded={showReviewForm}
            >
              {showReviewForm ? <><ChevronUp size={14} /> Tutup</> : <><Star size={14} /> Beri Ulasan</>}
            </button>
          </div>

          {showReviewForm && (
            <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <ReviewForm cafeId={cafe.id} onSuccess={() => { setShowReviewForm(false); fetchReviews(); }} />
            </div>
          )}

          {loadRev ? (
            <LoadingSpinner />
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
              <p>😊 Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{r.nickname}</span>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={12} fill={s <= r.rating ? '#f59e0b' : 'none'} stroke={s <= r.rating ? '#f59e0b' : 'var(--color-border)'} />
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {new Date(r.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {r.tags?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'var(--space-2)' }}>
                      {r.tags.map((tag) => (
                        <span key={tag} className="badge badge-primary" style={{ fontSize: '10px' }}>{tag}</span>
                      ))}
                    </div>
                  )}
                  {r.comment && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={{ height: 'var(--space-6)' }} />
      </div>
    </div>
  );
}
