import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  Length,
} from "sequelize-typescript";

/**
 * Task Model using Sequelize TypeScript
 * Active Record pattern with decorators
 */
@Table({
  tableName: "task",
  timestamps: true,    // Enable automatic timestamp management
  createdAt: "created_at",  // Use our column name
  updatedAt: false,    // We don't need updatedAt
  underscored: true,   // Use snake_case for columns
})
export class TaskModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Length({ min: 1, max: 255 })
  @Column(DataType.STRING(255))
  declare title: string;

  @AllowNull(false)
  @Length({ min: 1 })
  @Column(DataType.TEXT)
  declare description: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_completed: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  /**
   * Instance method: Mark task as completed
   */
  async complete(): Promise<this> {
    if (this.is_completed) {
      throw new Error("Task is already completed");
    }
    this.is_completed = true;
    await this.save();
    return this;
  }

  /**
   * Instance method: Check if task is completed
   */
  isCompleted(): boolean {
    return this.is_completed;
  }

  /**
   * Instance method: Check if task is pending
   */
  isPending(): boolean {
    return !this.is_completed;
  }

  /**
   * Instance method: Check if task is old (more than 7 days)
   */
  isOld(): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.created_at < sevenDaysAgo;
  }

  /**
   * Instance method: Get task status as string
   */
  getStatus(): string {
    return this.is_completed ? "Completed" : "Pending";
  }

  /**
   * Instance method: Get formatted date
   */
  getFormattedDate(): string {
    return this.created_at.toISOString();
  }

  /**
   * Instance method: String representation
   */
  toString(): string {
    return `Task #${this.id}: ${this.title} [${this.getStatus()}]`;
  }

  /**
   * Instance method: Convert to plain object (for API responses)
   */
  toJSON(): object {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      isCompleted: this.is_completed,
      createdAt: this.created_at,
    };
  }

  /**
   * Static method: Find recent non-completed tasks
   */
  static async findRecentNonCompleted(limit: number = 5): Promise<TaskModel[]> {
    return await TaskModel.findAll({
      where: { is_completed: false },
      order: [["created_at", "DESC"]],
      limit,
    });
  }

  /**
   * Static method: Create a new task
   */
  static async createTask(title: string, description: string): Promise<TaskModel> {
    return await TaskModel.create({ title, description });
  }
}

