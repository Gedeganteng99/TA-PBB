import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCafes } from '../hooks/useCafes.js';
import CafeCard from '../components/cafe/CafeCard.jsx';
import { SkeletonCard } from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { AREAS } from '../constants/index.js';

const SORT_OPTIONS = [
  { value: 'study_score', label: '📚 Study Score' },
  { value: 'rating',      label: '⭐ Rating' },
  { value: 'distance',    label: '📍 Jarak' },
  { value: 'price',       label: '💰 Harga' },
];

export default function CafeListPage() {
  const [search, setSearch]         = useState('');
  const [area, setArea]             = useState('');
  const [sort, setSort]             = useState('study_score');
  const [openNow, setOpenNow]       = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [minWifi, setMinWifi]       = useState('');
  const [minOutlet, setMinOutlet]   = useState('');

  const { cafes, total, loading, error, refetch, setParams } = useCafes({
    sort: 'study_score', limit: 20,
  });

  const applyFilter = useCallback(() => {
    setParams({
      search:     search || undefined,
      area:       area   || undefined,
      sort,
      open_now:   openNow ? 'true' : undefined,
      min_wifi:   minWifi || undefined,
      min_outlet: minOutlet || undefined,
      limit: 20,
    });
    setShowFilter(false);
  }, [search, area, sort, openNow, minWifi, minOutlet, setParams]);

  const clearFilters = () => {
    setSearch(''); setArea(''); setSort('study_score');
    setOpenNow(false); setMinWifi(''); setMinOutlet('');
    setParams({ sort: 'study_score', limit: 20 });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Daftar Kafe</h1>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} className="search-bar-icon" aria-hidden="true" />
        <input
          id="cafe-search-input"
          type="search"
          className="form-input"
          placeholder="Cari nama kafe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
          aria-label="Cari kafe"
        />
      </div>

      {/* Quick filter chips */}
      <div className="chip-row" role="group" aria-label="Filter cepat">
        <button
          className={`chip${openNow ? ' active' : ''}`}
          onClick={() => { setOpenNow(!openNow); setTimeout(applyFilter, 50); }}
          id="filter-open-now"
          aria-pressed={openNow}
        >
          🟢 Buka Sekarang
        </button>
        {AREAS.map((a) => (
          <button
            key={a}
            className={`chip${area === a ? ' active' : ''}`}
            onClick={() => { setArea(area === a ? '' : a); setTimeout(applyFilter, 50); }}
            id={`filter-area-${a.toLowerCase()}`}
            aria-pressed={area === a}
          >
            {a}
          </button>
        ))}
        <button
          className="chip"
          onClick={() => setShowFilter(true)}
          id="filter-advanced-btn"
          aria-label="Filter lanjutan"
        >
          <SlidersHorizontal size={12} /> Filter
        </button>
      </div>

      {/* Sort chips */}
      <div className="chip-row" role="group" aria-label="Urutan">
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`chip${sort === value ? ' active' : ''}`}
            onClick={() => { setSort(value); setTimeout(applyFilter, 50); }}
            id={`sort-${value}`}
            aria-pressed={sort === value}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Total */}
      {!loading && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          {total} kafe ditemukan
        </p>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : cafes.length === 0 ? (
        <EmptyState
          title="Kafe tidak ditemukan"
          description="Coba ubah kata kunci atau filter pencarian"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {cafes.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} />)}
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setShowFilter(false)}>
          <div
            style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: 'var(--space-6)', width: '100%', maxWidth: 480, margin: '0 auto' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Filter lanjutan"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Filter Lanjutan</h3>
              <button className="icon-btn" onClick={() => setShowFilter(false)} aria-label="Tutup filter"><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="filter-min-wifi">WiFi Minimum (Mbps)</label>
                <input id="filter-min-wifi" type="number" className="form-input" value={minWifi} onChange={(e) => setMinWifi(e.target.value)} placeholder="Contoh: 20" min={0} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="filter-min-outlet">Colokan Minimum (1-5)</label>
                <input id="filter-min-outlet" type="number" className="form-input" value={minOutlet} onChange={(e) => setMinOutlet(e.target.value)} placeholder="Contoh: 3" min={1} max={5} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={clearFilters} id="filter-clear-btn">Reset</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={applyFilter} id="filter-apply-btn">Terapkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
