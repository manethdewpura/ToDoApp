import { type ExpressRequest, type ExpressResponse, type ExpressNextFunction } from "../types/index.js";
import { taskService } from "../services/index.js";
import { CreateTaskDto, CompleteTaskDto } from "../dtos/index.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../common/index.js";
import { ValidationError } from "../common/index.js";

/**
 * Task Controller using Sequelize TypeScript
 */
export class TaskController {
  /**
   * POST /tasks - Create a new task
   */
  async createTask(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> {
    try {
      const { title, description } = req.body;

      // Create and validate DTO
      const dto = new CreateTaskDto(title, description);

      // Create task
      const task = await taskService.createTask(dto);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.TASK_CREATED,
        data: task.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /tasks - Get recent non-completed tasks
   */
  async getRecentTasks(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> {
    try {
      const tasks = await taskService.getRecentTasks();
      const response = tasks.map((task) => task.toJSON());

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: response,
        count: response.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /tasks/:id/complete - Mark task as completed
   */
  async completeTask(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Create and validate DTO
      const dto = new CompleteTaskDto(id ?? "");
      const validation = dto.validate();

      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(", "));
      }

      // Complete task
      const task = await taskService.completeTask(dto.id);

      // Return response
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TASK_COMPLETED,
        data: task.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /tasks/:id - Get task by ID
   */
  async getTaskById(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const dto = new CompleteTaskDto(id ?? "");
      const validation = dto.validate();

      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(", "));
      }

      const task = await taskService.getTaskById(dto.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: task.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const taskController = new TaskController();
