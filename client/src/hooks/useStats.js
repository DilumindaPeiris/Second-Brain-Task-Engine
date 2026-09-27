import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

/**
 * Custom hook for fetching task statistics from the backend.
 * Used by the dashboard/stats panel.
 */
export default function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
