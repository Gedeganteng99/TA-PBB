import { Coffee } from 'lucide-react';

export default function EmptyState({ title = 'Tidak ada data', description = '', icon }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        {icon ?? <Coffee size={48} strokeWidth={1.5} />}
      </div>
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}
