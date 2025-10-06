import { TaskModel } from "../models/index.js";
import type { FindOptions, WhereOptions } from "sequelize";

/**
 * Task Data Access Object
 * Handles all database operations for tasks
 */
export class TaskDAO {
  /**
   * Create a new task in the database
   */
  async create(data: {
    title: string;
    description: string;
    is_completed?: boolean;
  }): Promise<TaskModel> {
    return await TaskModel.create(data);
  }

  /**
   * Find a task by its primary key (ID)
   */
  async findById(id: number): Promise<TaskModel | null> {
    return await TaskModel.findByPk(id);
  }

  /**
   * Find all tasks with optional filtering and ordering
   */
  async findAll(options?: FindOptions<TaskModel>): Promise<TaskModel[]> {
    return await TaskModel.findAll(options);
  }

  /**
   * Find tasks by a specific condition
   */
  async findWhere(
    where: WhereOptions<TaskModel>,
    options?: Omit<FindOptions<TaskModel>, "where">
  ): Promise<TaskModel[]> {
    return await TaskModel.findAll({
      where,
      ...options,
    });
  }

  /**
   * Find one task by a specific condition
   */
  async findOne(where: WhereOptions<TaskModel>): Promise<TaskModel | null> {
    return await TaskModel.findOne({ where });
  }

  /**
   * Update a task in the database
   */
  async update(
    task: TaskModel,
    data: Partial<{
      title: string;
      description: string;
      is_completed: boolean;
    }>
  ): Promise<TaskModel> {
    await task.update(data);
    return task;
  }

  /**
   * Delete a task from the database
   */
  async delete(task: TaskModel): Promise<void> {
    await task.destroy();
  }

  /**
   * Mark a task as completed
   */
  async markAsCompleted(task: TaskModel): Promise<TaskModel> {
    task.is_completed = true;
    await task.save();
    return task;
  }

  /**
   * Get recent non-completed tasks
   */
  async findRecentNonCompleted(limit: number = 5): Promise<TaskModel[]> {
    return await this.findWhere(
      { is_completed: false },
      {
        order: [["created_at", "DESC"]],
        limit,
      }
    );
  }

  /**
   * Get all tasks ordered by creation date
   */
  async findAllOrderedByDate(): Promise<TaskModel[]> {
    return await this.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  /**
   * Count tasks by condition
   */
  async count(where?: WhereOptions<TaskModel>): Promise<number> {
    if (where) {
      return await TaskModel.count({ where });
    }
    return await TaskModel.count();
  }

  /**
   * Check if a task exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await this.count({ id });
    return count > 0;
  }
}

// Export singleton instance
export const taskDAO = new TaskDAO();

