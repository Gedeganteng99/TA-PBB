export default function LoadingSpinner({ size = 36, label = 'Memuat...' }) {
  return (
    <div className="loading-center" role="status" aria-label={label}>
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="shimmer" style={{ height: 180 }} />
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="shimmer" style={{ height: 20, width: '70%' }} />
        <div className="shimmer" style={{ height: 14, width: '90%' }} />
        <div className="shimmer" style={{ height: 14, width: '50%' }} />
      </div>
    </div>
  );
}
