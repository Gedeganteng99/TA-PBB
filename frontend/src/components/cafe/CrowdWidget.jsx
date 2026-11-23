import { useState } from 'react';
import { Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { crowdService } from '../../services/crowdService.js';
import { getUserId } from '../../services/favoriteService.js';
import { timeAgo } from '../../utils/timeUtils.js';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

const LEVELS = [
  { value: 'sepi',   label: '😌 Sepi',   color: 'sepi' },
  { value: 'sedang', label: '🙂 Sedang', color: 'sedang' },
  { value: 'ramai',  label: '😮 Ramai',  color: 'ramai' },
];

export default function CrowdWidget({ cafeId, crowdStatus, onUpdate }) {
  const [selected, setSelected]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback]   = useState(null);
  const isOnline = useOnlineStatus();

  const handleReport = async (level) => {
    if (!isOnline) {
      setFeedback({ type: 'error', msg: 'Tidak ada koneksi. Coba lagi saat online.' });
      return;
    }
    setSelected(level);
    setSubmitting(true);
    setFeedback(null);
    try {
      await crowdService.report(cafeId, { user_id: getUserId(), level });
      setFeedback({ type: 'success', msg: 'Terima kasih atas laporanmu!' });
      onUpdate?.();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  const crowdColor = crowdStatus?.level ? `var(--color-${crowdStatus.level})` : 'var(--color-text-muted)';

  return (
    <div className="crowd-widget">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Users size={16} style={{ color: crowdColor }} />
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: crowdColor }}>
            {crowdStatus
              ? crowdStatus.level.charAt(0).toUpperCase() + crowdStatus.level.slice(1)
              : 'Belum ada laporan'}
          </span>
        </div>
        {crowdStatus && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <Clock size={11} />
            <span>{timeAgo(crowdStatus.reported_at)}</span>
          </div>
        )}
        {feedback && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 'var(--text-xs)', color: feedback.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>
            {feedback.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            <span>{feedback.msg}</span>
          </div>
        )}
      </div>

      <div>
        <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: 6, textAlign: 'right' }}>Laporkan kondisi:</p>
        <div className="crowd-levels">
          {LEVELS.map(({ value, label, color }) => (
            <button
              key={value}
              className={`crowd-btn ${color}${selected === value ? ' selected' : ''}`}
              onClick={() => handleReport(value)}
              disabled={submitting}
              id={`crowd-btn-${value}-${cafeId}`}
              aria-label={`Laporkan kondisi ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
