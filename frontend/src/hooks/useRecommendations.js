import { useState, useCallback } from 'react';
import { recommendationService } from '../services/recommendationService.js';

export function useRecommendations() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendations = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const res = await recommendationService.get(body);
      setResults(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, getRecommendations };
}
