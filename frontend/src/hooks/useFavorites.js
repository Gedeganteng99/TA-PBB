import { useState, useEffect, useCallback } from 'react';
import { favoriteService, getUserId } from '../services/favoriteService.js';
import { cafeService } from '../services/cafeService.js';

export function useFavorites() {
  const [favIds, setFavIds] = useState(() => favoriteService.getLocalFavIds());
  const [favCafes, setFavCafes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sinkron dari server saat online
  const syncFromServer = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      const userId = getUserId();
      const res = await favoriteService.getAll(userId);
      const serverFavs = res.data.data ?? [];
      const ids = serverFavs.map((f) => f.cafe_id);
      localStorage.setItem('ngopikampus_favorites', JSON.stringify(ids));
      setFavIds(ids);
    } catch (e) {
      // Gunakan local saat gagal
    }
  }, []);

  // Ambil detail kafe dari favorit lokal
  const loadFavCafes = useCallback(async () => {
    const ids = favoriteService.getLocalFavIds();
    if (!ids.length) { setFavCafes([]); return; }
    setLoading(true);
    try {
      const results = await Promise.allSettled(ids.map((id) => cafeService.getById(id)));
      const cafes = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value.data.data);
      setFavCafes(cafes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncFromServer();
    loadFavCafes();
  }, []);

  const toggle = useCallback(async (cafeId) => {
    // Optimistic update (local)
    const added = favoriteService.toggleLocal(cafeId);
    setFavIds(favoriteService.getLocalFavIds());

    // Sinkron ke server
    if (navigator.onLine) {
      try {
        const userId = getUserId();
        await favoriteService.toggle(cafeId, userId);
      } catch (e) { /* ignore */ }
    }

    await loadFavCafes();
    return added;
  }, [loadFavCafes]);

  const isFav = useCallback((cafeId) => favIds.includes(cafeId), [favIds]);

  return { favIds, favCafes, loading, toggle, isFav, reload: loadFavCafes };
}
