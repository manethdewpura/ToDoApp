import { TaskModel } from "../models/index.js";
import { type CreateTaskDto } from "../dtos/index.js";
import { NotFoundError, ValidationError, ERROR_MESSAGES } from "../common/index.js";
import { taskDAO } from "../dao/index.js";

/**
 * Task Service using DAO pattern
 * Business logic layer - uses DAO for data access
 */
export class TaskService {
  /**
   * Create a new task
   */
  async createTask(dto: CreateTaskDto): Promise<TaskModel> {
    const validation = dto.validate();
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(", "));
    }

    try {
      const task = await taskDAO.create({
        title: dto.title,
        description: dto.description,
      });
      return task;
    } catch (error) {
      if (error instanceof Error && error.name === "SequelizeValidationError") {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }

  /**
   * Get recent non-completed tasks
   */
  async getRecentTasks(): Promise<TaskModel[]> {
    const tasks = await taskDAO.findRecentNonCompleted(5);
    return tasks;
  }

  /**
   * Mark a task as completed
   */
  async completeTask(id: number): Promise<TaskModel> {
    const task = await taskDAO.findById(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Check if already completed
    if (task.isCompleted()) {
      throw new ValidationError(ERROR_MESSAGES.TASK_ALREADY_COMPLETED);
    }

    await taskDAO.markAsCompleted(task);

    return task;
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: number): Promise<TaskModel> {
    const task = await taskDAO.findById(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    return task;
  }
}

// Export singleton instance
export const taskService = new TaskService();

