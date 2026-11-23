import { useState, useEffect } from 'react';
import { cafeService } from '../services/cafeService.js';

export function useCafe(id) {
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCafe = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await cafeService.getById(id);
      setCafe(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCafe(); }, [id]);

  return { cafe, loading, error, refetch: fetchCafe };
}
