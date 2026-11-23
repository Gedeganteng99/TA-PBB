import { STUDY_SCORE_FORMULA } from '../../constants/index.js';

export default function StudyScoreBar({ score, breakdown }) {
  const bars = [
    { key: 'wifi',   label: 'WiFi',    max: STUDY_SCORE_FORMULA.wifi.weight,   value: breakdown?.wifi ?? 0 },
    { key: 'outlet', label: 'Colokan', max: STUDY_SCORE_FORMULA.outlet.weight, value: breakdown?.outlet ?? 0 },
    { key: 'noise',  label: 'Tenang',  max: STUDY_SCORE_FORMULA.noise.weight,  value: breakdown?.noise ?? 0 },
    { key: 'seat',   label: 'Kursi',   max: STUDY_SCORE_FORMULA.seat.weight,   value: breakdown?.seat ?? 0 },
    { key: 'rating', label: 'Rating',  max: STUDY_SCORE_FORMULA.rating.weight, value: breakdown?.rating ?? 0 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div className="score-circle" aria-label={`Study Score ${score}`}>
          <span className="score-circle-num">{score}</span>
          <span className="score-circle-label">/ 100</span>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>Study Score</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Skor kelayakan belajar (0–100)
          </p>
        </div>
      </div>

      <div className="score-bar-wrap" role="list" aria-label="Rincian study score">
        {bars.map(({ key, label, max, value }) => (
          <div key={key} className="score-bar-row" role="listitem">
            <span className="score-bar-label">{label}</span>
            <div className="score-bar-track" aria-label={`${label}: ${value} dari ${max}`}>
              <div
                className="score-bar-fill"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="score-bar-value">{value}/{max}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
