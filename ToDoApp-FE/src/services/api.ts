import type { Task, ApiResponse, CreateTaskRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const taskApi = {
  /**
   * Fetch the 5 most recent incomplete tasks
   */
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const data: ApiResponse<Task[]> = await response.json();
    
    if (!data.success) {
      throw new ApiError(
        data.error?.statusCode || 500,
        data.error?.message || 'Failed to fetch tasks'
      );
    }
    
    return data.data || [];
  },

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    const data: ApiResponse<Task> = await response.json();
    
    if (!data.success || !data.data) {
      throw new ApiError(
        data.error?.statusCode || 500,
        data.error?.message || 'Failed to create task'
      );
    }
    
    return data.data;
  },

  /**
   * Mark a task as complete
   */
  async completeTask(taskId: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });

    const data: ApiResponse<Task> = await response.json();
    
    if (!data.success || !data.data) {
      throw new ApiError(
        data.error?.statusCode || 500,
        data.error?.message || 'Failed to complete task'
      );
    }
    
    return data.data;
  },
};
