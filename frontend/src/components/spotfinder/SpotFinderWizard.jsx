import { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import ErrorState from '../ui/ErrorState.jsx';
import CafeCard from '../cafe/CafeCard.jsx';
import { useRecommendations } from '../../hooks/useRecommendations.js';

const PURPOSES = [
  { value: 'skripsi',       label: '📝 Skripsi Sendiri',  desc: 'Butuh suasana tenang, WiFi kencang, colokan banyak' },
  { value: 'kerja-kelompok', label: '👥 Kerja Kelompok',  desc: 'Meja lebar, kapasitas besar, WiFi stabil' },
  { value: 'santai',        label: '😌 Nongkrong Santai', desc: 'Harga terjangkau, suasana asyik' },
];

const BUDGETS = [
  { value: 10000,  label: '< Rp 10.000' },
  { value: 20000,  label: '< Rp 20.000' },
  { value: 35000,  label: '< Rp 35.000' },
  { value: 999999, label: 'Bebas' },
];

export default function SpotFinderWizard() {
  const [step, setStep]           = useState(1);
  const [purpose, setPurpose]     = useState('');
  const [budget, setBudget]       = useState(999999);
  const [groupSize, setGroupSize] = useState(1);
  const [needWifi, setNeedWifi]   = useState(false);
  const [needOutlet, setNeedOutlet] = useState(false);

  const { results, loading, error, getRecommendations } = useRecommendations();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSearch();
  };

  const handleSearch = () => {
    getRecommendations({
      purpose,
      budget,
      group_size: groupSize,
      need_wifi:   needWifi,
      need_outlet: needOutlet,
    });
    setStep(4);
  };

  const reset = () => { setStep(1); setPurpose(''); setBudget(999999); setGroupSize(1); setNeedWifi(false); setNeedOutlet(false); };

  return (
    <div>
      {/* Step indicators */}
      {step < 4 && (
        <div className="wizard-steps" aria-label="Langkah wizard">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`wizard-step${step === s ? ' active' : ''}${step > s ? ' done' : ''}`}>
              <div className="wizard-dot">{step > s ? '✓' : s}</div>
              <span className="wizard-label">{['Tujuan', 'Budget', 'Detail'][s - 1]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Tujuan */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
            Mau ngapain hari ini?
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
            Pilih tujuan utamamu
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {PURPOSES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setPurpose(value)}
                id={`purpose-${value}`}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${purpose === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: purpose === value ? 'rgba(111,78,55,0.08)' : 'var(--color-surface)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                aria-pressed={purpose === value}
              >
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
            Budget per orang?
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
            Harga minimum menu yang ingin kamu pesan
          </p>
          <div className="grid-2">
            {BUDGETS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setBudget(value)}
                id={`budget-${value}`}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${budget === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: budget === value ? 'rgba(111,78,55,0.08)' : 'var(--color-surface)',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                }}
                aria-pressed={budget === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Detail */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)' }}>Detail kebutuhan</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="group-size">
              Jumlah orang: <strong>{groupSize}</strong>
            </label>
            <input
              id="group-size"
              type="range"
              min={1} max={20}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              <span>1 orang</span><span>20 orang</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', minHeight: 44 }}>
              <input
                type="checkbox"
                checked={needWifi}
                onChange={(e) => setNeedWifi(e.target.checked)}
                id="need-wifi"
                style={{ width: 20, height: 20, accentColor: 'var(--color-primary)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>📶 Butuh WiFi kencang</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Filter kafe dengan WiFi minimal 10 Mbps</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', minHeight: 44 }}>
              <input
                type="checkbox"
                checked={needOutlet}
                onChange={(e) => setNeedOutlet(e.target.checked)}
                id="need-outlet"
                style={{ width: 20, height: 20, accentColor: 'var(--color-primary)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>🔌 Butuh colokan</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Filter kafe dengan colokan level minimal 2</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div>
          {loading && <LoadingSpinner label="Mencari rekomendasi..." />}
          {error && <ErrorState message={error} onRetry={handleSearch} />}
          {results && !loading && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)' }}>
                  🎯 {results.cafes.length} Rekomendasi
                </h2>
                <button className="btn btn-secondary btn-sm" onClick={reset} id="spotfinder-reset-btn">
                  Ulangi
                </button>
              </div>

              {results.cafes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-text-muted)' }}>
                  <p style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>😔</p>
                  <p style={{ fontWeight: 700 }}>Tidak ada kafe yang cocok</p>
                  <p style={{ fontSize: 'var(--text-sm)', marginTop: 8 }}>Coba ubah filter budget atau kebutuhan</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {results.cafes.map((cafe, i) => (
                    <div key={cafe.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'var(--color-bg-secondary)',
                          color: i === 0 ? '#fff' : 'var(--color-text-secondary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 'var(--text-sm)', flexShrink: 0,
                        }}>#{i + 1}</span>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
                          Skor Rekomendasi: {cafe.recommendation_score}/100
                        </div>
                      </div>

                      {/* Alasan */}
                      {cafe.reasons?.length > 0 && (
                        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {cafe.reasons.map((r, j) => (
                              <span key={j} style={{ fontSize: '11px', background: 'var(--color-surface)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', fontWeight: 600 }}>
                                ✓ {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <CafeCard cafe={cafe} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      {step < 4 && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)} id="wizard-back-btn">
              <ChevronLeft size={16} />
              Kembali
            </button>
          )}
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleNext}
            disabled={step === 1 && !purpose}
            id="wizard-next-btn"
          >
            {step === 3 ? (
              <><Sparkles size={16} /> Cari Kafe</>
            ) : (
              <>Lanjut <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
