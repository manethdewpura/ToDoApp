import { TaskModel } from "../models/index.js";
import { type CreateTaskDto } from "../dtos/index.js";
import { NotFoundError, ValidationError, ERROR_MESSAGES } from "../common/index.js";

/**
 * Task Service using Sequelize TypeScript ORM
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
      // Create task using Sequelize model
      const task = await TaskModel.create({
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
    const tasks = await TaskModel.findAll({
      where: { is_completed: false },
      order: [["created_at", "DESC"]],
      limit: 5,
    });
    return tasks;
  }

  /**
   * Mark a task as completed
   */
  async completeTask(id: number): Promise<TaskModel> {
    // Find task
    const task = await TaskModel.findByPk(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Check if already completed
    if (task.isCompleted()) {
      throw new ValidationError(ERROR_MESSAGES.TASK_ALREADY_COMPLETED);
    }

    // Complete using model method
    await task.complete();

    return task;
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: number): Promise<TaskModel> {
    const task = await TaskModel.findByPk(id);

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
    const task = await TaskModel.findByPk(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Update using Sequelize
    await task.update(data);

    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    const task = await TaskModel.findByPk(id);

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Delete using Sequelize
    await task.destroy();
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<TaskModel[]> {
    const tasks = await TaskModel.findAll({
      order: [["created_at", "DESC"]],
    });
    return tasks;
  }
}

// Export singleton instance
export const taskService = new TaskService();

