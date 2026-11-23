import { useState, useEffect } from 'react';
import { cafeService } from '../services/cafeService.js';

export function useCafes(initialParams = {}) {
  const [cafes, setCafes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchCafes = async (p = params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await cafeService.getAll(p);
      setCafes(res.data.data.cafes ?? []);
      setTotal(res.data.data.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCafes(); }, [JSON.stringify(params)]);

  return { cafes, total, loading, error, refetch: fetchCafes, setParams };
}
