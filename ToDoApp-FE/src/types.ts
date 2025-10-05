export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
  };
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}
