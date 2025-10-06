import { TaskService } from '../../services/task.service.js';
import { TaskModel } from '../../models/task.model.js';
import { CreateTaskDto } from '../../dtos/task.dto.js';
import { ValidationError, NotFoundError, ERROR_MESSAGES } from '../../common/index.js';
import { taskDAO } from '../../dao/index.js';

// Mock the DAO
jest.mock('../../dao/index.js');

const MockedTaskDAO = taskDAO as jest.Mocked<typeof taskDAO>;

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTask: jest.Mocked<TaskModel>;

  beforeEach(() => {
    jest.clearAllMocks();
    taskService = new TaskService();

    // Create a mock task instance
    mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      is_completed: false,
      created_at: new Date('2024-01-01T12:00:00Z'),
      complete: jest.fn(),
      isCompleted: jest.fn(),
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isCompleted: false,
        createdAt: new Date('2024-01-01T12:00:00Z')
      })
    } as any;
  });

  describe('createTask', () => {
    it('should create a task successfully with valid DTO', async () => {
      const dto = new CreateTaskDto('New Task', 'New Description');
      MockedTaskDAO.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(dto);

      expect(MockedTaskDAO.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description'
      });
      expect(result).toBe(mockTask);
    });

    it('should throw ValidationError for invalid DTO', async () => {
      const dto = new CreateTaskDto('', 'Valid Description');

      await expect(taskService.createTask(dto)).rejects.toThrow(ValidationError);
      expect(MockedTaskDAO.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for Sequelize validation error', async () => {
      const dto = new CreateTaskDto('Valid Task', 'Valid Description');
      const sequelizeError = new Error('Validation error');
      sequelizeError.name = 'SequelizeValidationError';
      MockedTaskDAO.create.mockRejectedValue(sequelizeError);

      await expect(taskService.createTask(dto)).rejects.toThrow(ValidationError);
    });

    it('should rethrow non-Sequelize errors', async () => {
      const dto = new CreateTaskDto('Valid Task', 'Valid Description');
      const error = new Error('Database connection failed');
      MockedTaskDAO.create.mockRejectedValue(error);

      await expect(taskService.createTask(dto)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getRecentTasks', () => {
    it('should return recent non-completed tasks', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      MockedTaskDAO.findRecentNonCompleted.mockResolvedValue(mockTasks as any);

      const result = await taskService.getRecentTasks();

      expect(MockedTaskDAO.findRecentNonCompleted).toHaveBeenCalledWith(5);
      expect(result).toBe(mockTasks);
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      MockedTaskDAO.findById.mockResolvedValue(mockTask);
      mockTask.isCompleted.mockReturnValue(false);
      MockedTaskDAO.markAsCompleted.mockResolvedValue(mockTask);

      const result = await taskService.completeTask(1);

      expect(MockedTaskDAO.findById).toHaveBeenCalledWith(1);
      expect(mockTask.isCompleted).toHaveBeenCalled();
      expect(MockedTaskDAO.markAsCompleted).toHaveBeenCalledWith(mockTask);
      expect(result).toBe(mockTask);
    });

    it('should throw NotFoundError when task does not exist', async () => {
      MockedTaskDAO.findById.mockResolvedValue(null);

      await expect(taskService.completeTask(999)).rejects.toThrow(NotFoundError);
      expect(MockedTaskDAO.findById).toHaveBeenCalledWith(999);
    });

    it('should throw ValidationError when task is already completed', async () => {
      MockedTaskDAO.findById.mockResolvedValue(mockTask);
      mockTask.isCompleted.mockReturnValue(true);

      await expect(taskService.completeTask(1)).rejects.toThrow(ValidationError);
      expect(MockedTaskDAO.markAsCompleted).not.toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', async () => {
      MockedTaskDAO.findById.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(MockedTaskDAO.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockTask);
    });

    it('should throw NotFoundError when task does not exist', async () => {
      MockedTaskDAO.findById.mockResolvedValue(null);

      await expect(taskService.getTaskById(999)).rejects.toThrow(NotFoundError);
      expect(MockedTaskDAO.findById).toHaveBeenCalledWith(999);
    });
  });

});
