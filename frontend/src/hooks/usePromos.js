import { useState, useEffect } from 'react';
import { promoService } from '../services/promoService.js';

export function usePromos(initialParams = {}) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromos = async (params = initialParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await promoService.getAll(params);
      setPromos(res.data.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromos(initialParams); }, [JSON.stringify(initialParams)]);

  return { promos, loading, error, refetch: fetchPromos };
}
