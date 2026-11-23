import { useState } from 'react';
import { Star, Send, AlertCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService.js';
import { getUserId } from '../../services/favoriteService.js';
import { REVIEW_TAGS } from '../../constants/index.js';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

export default function ReviewForm({ cafeId, onSuccess }) {
  const [nickname, setNickname] = useState('');
  const [rating, setRating]     = useState(0);
  const [hover, setHover]       = useState(0);
  const [comment, setComment]   = useState('');
  const [tags, setTags]         = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);
  const isOnline = useOnlineStatus();

  const toggleTag = (tag) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOnline) { setError('Tidak ada koneksi internet.'); return; }
    if (!nickname.trim()) { setError('Nickname wajib diisi'); return; }
    if (rating === 0)     { setError('Pilih rating bintang'); return; }

    setSubmitting(true);
    setError(null);
    try {
      await reviewService.create(cafeId, {
        user_id: getUserId(),
        nickname: nickname.trim(),
        rating,
        comment: comment.trim() || null,
        tags,
      });
      setNickname(''); setRating(0); setComment(''); setTags([]);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} aria-label="Form ulasan kafe">
      <div className="form-group">
        <label className="form-label" htmlFor="review-nickname">Nama / Nickname</label>
        <input
          id="review-nickname"
          type="text"
          className="form-input"
          placeholder="Nama kamu..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={50}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Rating</label>
        <div className="star-rating" role="radiogroup" aria-label="Pilih rating bintang">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${star} bintang`}
              id={`star-${star}`}
              style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer' }}
            >
              <Star
                size={28}
                fill={(hover || rating) >= star ? '#f59e0b' : 'none'}
                stroke={(hover || rating) >= star ? '#f59e0b' : 'var(--color-border)'}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tag (opsional)</label>
        <div className="tag-list">
          {REVIEW_TAGS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`tag${tags.includes(value) ? ' selected' : ''}`}
              onClick={() => toggleTag(value)}
              id={`tag-${value}`}
              aria-pressed={tags.includes(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">Komentar (opsional)</label>
        <textarea
          id="review-comment"
          className="form-input form-textarea"
          placeholder="Ceritakan pengalamanmu di sini..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
        />
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={submitting}
        id="review-submit-btn"
      >
        <Send size={16} />
        {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
      </button>
    </form>
  );
}
