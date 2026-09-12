import { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../services/taskService.js';

/**
 * Custom hook for fetching and managing the task list.
 *
 * @param {{ projectId?: number, search?: string, status?: string, priority?: string }} filters
 * @returns {{ tasks, loading, error, refetch }}
 */
export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Strip empty strings so they don't pollute query params
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
      );
      const data = await getTasks(params);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}
