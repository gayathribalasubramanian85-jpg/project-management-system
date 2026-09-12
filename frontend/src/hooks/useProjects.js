import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../services/projectService.js';

/**
 * Custom hook for fetching and managing the projects list.
 *
 * @param {{ search?: string, status?: string }} filters
 * @returns {{ projects, loading, error, refetch }}
 */
export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Strip empty strings so they don't pollute query params
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const data = await getProjects(params);
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
