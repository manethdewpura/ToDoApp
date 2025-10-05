import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import { taskApi, ApiError } from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  addTask: (title: string, description: string) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, description: string) => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await taskApi.createTask({ title, description });
      setSuccessMessage('Task added successfully!');
      await fetchTasks();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding task:', err);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to add task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: number) => {
    try {
      await taskApi.completeTask(taskId);
      setSuccessMessage('Task completed!');
      await fetchTasks();
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      console.error('Error completing task:', err);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to complete task';
      setError(errorMessage);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return {
    tasks,
    loading,
    error,
    successMessage,
    addTask,
    completeTask,
    clearError,
    clearSuccess,
  };
}
