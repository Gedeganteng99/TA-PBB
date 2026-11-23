import { useState } from 'react';
import { usePromos } from '../hooks/usePromos.js';
import PromoCard from '../components/promo/PromoCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function PromoListPage() {
  const [activeTab, setActiveTab] = useState('active');

  const { promos: activePromos, loading: loadingActive, error: errorActive, refetch: refetchActive } = usePromos({ active: 'true' });
  const { promos: allPromos,    loading: loadingAll,    error: errorAll,    refetch: refetchAll    } = usePromos();

  const promos   = activeTab === 'active' ? activePromos : allPromos;
  const loading  = activeTab === 'active' ? loadingActive : loadingAll;
  const error    = activeTab === 'active' ? errorActive   : errorAll;
  const refetch  = activeTab === 'active' ? refetchActive : refetchAll;

  return (
    <div className="page-container">
      <h1 className="page-title">🏷️ Promo Mahasiswa</h1>
      <p className="page-subtitle">Diskon dan promo spesial untuk mahasiswa Undip</p>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', marginBottom: 'var(--space-5)', gap: 'var(--space-6)' }} role="tablist" aria-label="Tab promo">
        {[
          { id: 'active', label: '✅ Aktif' },
          { id: 'all',    label: '📋 Semua' },
        ].map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            id={`promo-tab-${id}`}
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: 'var(--space-2) 0',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: `3px solid ${activeTab === id ? 'var(--color-primary)' : 'transparent'}`,
              marginBottom: -2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : promos.length === 0 ? (
        <EmptyState title="Tidak ada promo" description={activeTab === 'active' ? 'Belum ada promo aktif saat ini' : 'Belum ada promo tersedia'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {promos.map((promo) => <PromoCard key={promo.id} promo={promo} />)}
        </div>
      )}
    </div>
  );
}
