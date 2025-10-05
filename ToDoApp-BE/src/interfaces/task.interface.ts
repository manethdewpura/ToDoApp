export interface ITask {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: Date;
}

export interface ICreateTaskParams {
  title: string;
  description: string;
}

export interface IUpdateTaskParams {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

