import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Terjadi kesalahan', onRetry }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={48} strokeWidth={1.5} style={{ color: 'var(--color-error)', opacity: 0.7 }} />
      <p className="fw-700" style={{ fontSize: 'var(--text-lg)' }}>Oops!</p>
      <p className="text-muted text-sm" style={{ maxWidth: 260, textAlign: 'center' }}>{message}</p>
      {onRetry && (
        <button className="btn btn-primary mt-4" onClick={onRetry} id="error-retry-btn">
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
