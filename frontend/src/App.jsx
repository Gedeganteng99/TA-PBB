import { Routes, Route } from 'react-router-dom';
import Header       from './components/layout/Header.jsx';
import BottomNav    from './components/layout/BottomNav.jsx';
import OfflineBanner from './components/ui/OfflineBanner.jsx';

import HomePage        from './pages/HomePage.jsx';
import CafeListPage    from './pages/CafeListPage.jsx';
import CafeDetailPage  from './pages/CafeDetailPage.jsx';
import PromoListPage   from './pages/PromoListPage.jsx';
import PromoDetailPage from './pages/PromoDetailPage.jsx';
import SpotFinderPage  from './pages/SpotFinderPage.jsx';
import FavoritesPage   from './pages/FavoritesPage.jsx';
import ProfilePage     from './pages/ProfilePage.jsx';

export default function App() {
  return (
    <div className="app-layout">
      <Header />
      <OfflineBanner />

      <main className="main-content" id="main-content" role="main">
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/kafe"      element={<CafeListPage />} />
          <Route path="/kafe/:id"  element={<CafeDetailPage />} />
          <Route path="/promo"     element={<PromoListPage />} />
          <Route path="/promo/:id" element={<PromoDetailPage />} />
          <Route path="/cari"      element={<SpotFinderPage />} />
          <Route path="/favorit"   element={<FavoritesPage />} />
          <Route path="/profil"    element={<ProfilePage />} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>☕</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 8 }}>Halaman Tidak Ditemukan</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>URL yang kamu cari tidak ada.</p>
              <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
            </div>
          } />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}
