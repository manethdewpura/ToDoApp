import { pool } from "../db.js";
import { type ITask, type ICreateTaskParams } from "../interfaces/index.js";
import { DatabaseError } from "../common/index.js";

export class TaskDao {
  /**
   * Create a new task in the database
   */
  async create(params: ICreateTaskParams): Promise<ITask> {
    try {
      const query = `
        INSERT INTO task (title, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [params.title, params.description];
      const result = await pool.query<ITask>(query, values);1

      if (!result.rows[0]) {
        throw new DatabaseError("Failed to create task");
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      console.error("Error in TaskDao.create:", error);
      throw new DatabaseError("Failed to create task in database");
    }
  }

  /**
   * Get recent non-completed tasks (last 5, ordered by created_at desc)
   */
  async getRecentNonCompleted(limit: number = 5): Promise<ITask[]> {
    try {
      const query = `
        SELECT * FROM task
        WHERE is_completed = false
        ORDER BY created_at DESC
        LIMIT $1
      `;
      const result = await pool.query<ITask>(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error("Error in TaskDao.getRecentNonCompleted:", error);
      throw new DatabaseError("Failed to fetch tasks from database");
    }
  }

  /**
   * Find a task by ID
   */
  async findById(id: number): Promise<ITask | null> {
    try {
      const query = "SELECT * FROM task WHERE id = $1";
      const result = await pool.query<ITask>(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in TaskDao.findById:", error);
      throw new DatabaseError("Failed to find task in database");
    }
  }

  /**
   * Mark a task as completed
   */
  async markAsCompleted(id: number): Promise<ITask | null> {
    try {
      const query = `
        UPDATE task
        SET is_completed = true
        WHERE id = $1
        RETURNING *
      `;
      const result = await pool.query<ITask>(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in TaskDao.markAsCompleted:", error);
      throw new DatabaseError("Failed to update task in database");
    }
  }

  /**
   * Delete a task by ID
   */
  async deleteById(id: number): Promise<boolean> {
    try {
      const query = "DELETE FROM task WHERE id = $1";
      const result = await pool.query(query, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error in TaskDao.deleteById:", error);
      throw new DatabaseError("Failed to delete task from database");
    }
  }

  /**
   * Get all tasks (for testing purposes)
   */
  async findAll(): Promise<ITask[]> {
    try {
      const query = "SELECT * FROM task ORDER BY created_at DESC";
      const result = await pool.query<ITask>(query);
      return result.rows;
    } catch (error) {
      console.error("Error in TaskDao.findAll:", error);
      throw new DatabaseError("Failed to fetch all tasks from database");
    }
  }
}

// Export singleton instance
export const taskDao = new TaskDao();

