import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallButton({ className = '' }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (installed || !prompt) return null;

  const handleInstall = async () => {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  };

  return (
    <button
      className={`btn btn-accent ${className}`}
      onClick={handleInstall}
      id="pwa-install-btn"
      aria-label="Install aplikasi NgopiKampus"
    >
      <Download size={18} />
      Install Aplikasi
    </button>
  );
}
