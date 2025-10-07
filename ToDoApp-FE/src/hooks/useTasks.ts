import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import { taskApi, ApiError } from '../services/api';
import { toast } from '../utils/toast';

interface UseTasksReturn {
  tasks: Task[];
  addTask: (title: string, description: string) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  // Keep tasks locally; surface notifications via toaster

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch tasks';
      toast.error(errorMessage);
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, description: string) => {
    try {
      await taskApi.createTask({ title, description });
      toast.success('Task added successfully!');
      await fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to add task';
      toast.error(errorMessage);
      throw err;
    }
  };

  const completeTask = async (taskId: number) => {
    try {
      await taskApi.completeTask(taskId);
      toast.success('Task completed!');
      await fetchTasks();
    } catch (err) {
      console.error('Error completing task:', err);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to complete task';
      toast.error(errorMessage);
    }
  };

  return {
    tasks,
    addTask,
    completeTask,
  };
}
