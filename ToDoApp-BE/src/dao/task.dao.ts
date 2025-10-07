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
   * Mark a task as completed
   */
  async markAsCompleted(task: TaskModel): Promise<TaskModel> {
    task.is_completed = true;
    await task.save();
    return task;
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
}

// Export singleton instance
export const taskDAO = new TaskDAO();
