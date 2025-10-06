import { type ITask } from "../interfaces/index.js";

export class CreateTaskDto {
  title: string;
  description: string;

  constructor(title: string, description: string) {
    this.title = title.trim();
    this.description = description.trim();
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title || this.title.length === 0) {
      errors.push("Title is required and must be a non-empty string");
    }

    if (this.title && this.title.length > 255) {
      errors.push("Title must not exceed 255 characters");
    }

    if (!this.description || this.description.length === 0) {
      errors.push("Description is required and must be a non-empty string");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export class TaskResponseDto {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;

  constructor(task: ITask) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.isCompleted = task.is_completed;
    this.createdAt = task.created_at;
  }

  static fromTaskArray(tasks: ITask[]): TaskResponseDto[] {
    return tasks.map((task) => new TaskResponseDto(task));
  }
}

export class CompleteTaskDto {
  id: number;

  constructor(id: string | number) {
    this.id = typeof id === "string" ? parseInt(id, 10) : id;
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (isNaN(this.id) || this.id <= 0 || !Number.isInteger(this.id)) {
      errors.push("Invalid task ID");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

