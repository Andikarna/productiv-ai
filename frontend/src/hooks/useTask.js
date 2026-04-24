import { useState, useCallback } from 'react';
import { taskAPI } from '../services/api';

export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const res = await taskAPI.getAll(filters);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const res = await taskAPI.create(data);
    setTasks((prev) => [...prev, res.data.task]);
    return res.data.task;
  }, []);

  const createNLTask = useCallback(async (text) => {
    const res = await taskAPI.createNL(text);
    setTasks((prev) => [...prev, res.data.task]);
    return res.data.task;
  }, []);

  const toggleTask = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    const res = await taskAPI.update(id, { status: newStatus });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data.task : t)));
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskAPI.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const overdueCount = tasks.filter(
    (t) => t.status === 'pending' && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return { tasks, loading, pendingCount, overdueCount, fetchTasks, createTask, createNLTask, toggleTask, deleteTask };
};
