import { Sparkles } from 'lucide-react';
import SpotFinderWizard from '../components/spotfinder/SpotFinderWizard.jsx';

export default function SpotFinderPage() {
  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3)' }}>
          <Sparkles size={28} color="#fff" />
        </div>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>Spot Finder</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Jawab 3 pertanyaan, kami carikan kafe yang paling cocok untukmu
        </p>
      </div>

      <SpotFinderWizard />
    </div>
  );
}
