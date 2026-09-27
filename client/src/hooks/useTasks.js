import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

/**
 * Custom hook for task CRUD and Kanban state management.
 * Returns tasks grouped by column, plus action handlers.
 */
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group tasks by status for the Kanban columns
  const columns = {
    'todo': tasks.filter(t => t.status === 'todo').sort((a, b) => a.order - b.order),
    'in-progress': tasks.filter(t => t.status === 'in-progress').sort((a, b) => a.order - b.order),
    'done': tasks.filter(t => t.status === 'done').sort((a, b) => a.order - b.order),
  };

  const createTask = async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, data]);
      toast.success('Task created');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(t => (t._id === id ? data : t)));
      toast.success('Task updated');
      return data;
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  const reorderTasks = async (reorderPayload) => {
    try {
      // Optimistic update: apply locally first
      setTasks(prev => {
        const updated = [...prev];
        for (const item of reorderPayload) {
          const idx = updated.findIndex(t => t._id === item.id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], status: item.status, order: item.order };
          }
        }
        return updated;
      });
      await api.patch('/tasks/reorder', { tasks: reorderPayload });
    } catch (err) {
      toast.error('Failed to save order');
      fetchTasks(); // Rollback on failure
    }
  };

  const addSnippet = async (taskId, snippet) => {
    try {
      const { data } = await api.post(`/tasks/${taskId}/snippets`, snippet);
      setTasks(prev => prev.map(t => (t._id === taskId ? data : t)));
      toast.success('Context added');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Failed to add context');
      throw err;
    }
  };

  const removeSnippet = async (taskId, snippetId) => {
    try {
      const { data } = await api.delete(`/tasks/${taskId}/snippets/${snippetId}`);
      setTasks(prev => prev.map(t => (t._id === taskId ? data : t)));
      toast.success('Context removed');
    } catch (err) {
      toast.error('Failed to remove context');
      throw err;
    }
  };

  return {
    tasks,
    columns,
    loading,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    addSnippet,
    removeSnippet,
    refetch: fetchTasks,
  };
}
