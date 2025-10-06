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
    // Validate DTO
    const validation = dto.validate();
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(", "));
    }

    try {
      // Create task using DAO
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
    // Find task using DAO
    const task = await taskDAO.findById(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Check if already completed
    if (task.isCompleted()) {
      throw new ValidationError(ERROR_MESSAGES.TASK_ALREADY_COMPLETED);
    }

    // Complete using DAO
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

  /**
   * Update a task
   */
  async updateTask(
    id: number,
    data: { title?: string; description?: string }
  ): Promise<TaskModel> {
    const task = await taskDAO.findById(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Update using DAO
    await taskDAO.update(task, data);

    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    const task = await taskDAO.findById(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Delete using DAO
    await taskDAO.delete(task);
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<TaskModel[]> {
    const tasks = await taskDAO.findAllOrderedByDate();
    return tasks;
  }
}

// Export singleton instance
export const taskService = new TaskService();

