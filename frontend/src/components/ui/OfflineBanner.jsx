import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner" role="alert" aria-live="polite">
      <WifiOff size={16} />
      <span>Anda sedang offline – menampilkan data terakhir dari cache</span>
    </div>
  );
}
