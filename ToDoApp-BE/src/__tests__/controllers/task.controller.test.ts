import { TaskController } from '../../controllers/task.controller.js';
import { taskService } from '../../services/task.service.js';
import { CreateTaskDto, CompleteTaskDto } from '../../dtos/task.dto.js';
import { ValidationError, NotFoundError } from '../../common/index.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../common/index.js';
import { type ExpressRequest, type ExpressResponse, type ExpressNextFunction } from '../../types/express.types.js';

// Mock the task service
jest.mock('../../services/task.service.js');
const MockedTaskService = taskService as jest.Mocked<typeof taskService>;

// Mock the DTOs
jest.mock('../../dtos/task.dto.js');
const MockedCreateTaskDto = CreateTaskDto as jest.MockedClass<typeof CreateTaskDto>;
const MockedCompleteTaskDto = CompleteTaskDto as jest.MockedClass<typeof CompleteTaskDto>;

describe('TaskController', () => {
  let controller: TaskController;
  let mockReq: Partial<ExpressRequest>;
  let mockRes: Partial<ExpressResponse>;
  let mockNext: jest.MockedFunction<ExpressNextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TaskController();

    mockReq = {
      body: {},
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isCompleted: false,
        createdAt: new Date('2024-01-01T12:00:00Z')
      };

      const mockDto = {
        title: 'Test Task',
        description: 'Test Description'
      };

      MockedCreateTaskDto.mockImplementation(() => mockDto as any);
      MockedTaskService.createTask.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockTask)
      } as any);

      mockReq.body = { title: 'Test Task', description: 'Test Description' };

      await controller.createTask(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(MockedCreateTaskDto).toHaveBeenCalledWith('Test Task', 'Test Description');
      expect(MockedTaskService.createTask).toHaveBeenCalledWith(mockDto);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: SUCCESS_MESSAGES.TASK_CREATED,
        data: mockTask
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws error', async () => {
      const mockDto = {
        title: 'Test Task',
        description: 'Test Description'
      };

      MockedCreateTaskDto.mockImplementation(() => mockDto as any);
      const error = new Error('Database error');
      MockedTaskService.createTask.mockRejectedValue(error);

      mockReq.body = { title: 'Test Task', description: 'Test Description' };

      await controller.createTask(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getRecentTasks', () => {
    it('should return recent tasks successfully', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          isCompleted: false,
          createdAt: new Date('2024-01-01T12:00:00Z')
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          isCompleted: false,
          createdAt: new Date('2024-01-02T12:00:00Z')
        }
      ];

      MockedTaskService.getRecentTasks.mockResolvedValue(
        mockTasks.map(task => ({ toJSON: jest.fn().mockReturnValue(task) })) as any
      );

      await controller.getRecentTasks(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(MockedTaskService.getRecentTasks).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTasks,
        count: 2
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws error', async () => {
      const error = new Error('Database error');
      MockedTaskService.getRecentTasks.mockRejectedValue(error);

      await controller.getRecentTasks(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isCompleted: true,
        createdAt: new Date('2024-01-01T12:00:00Z')
      };

      const mockDto = {
        id: 1,
        validate: jest.fn().mockReturnValue({ isValid: true, errors: [] })
      };

      MockedCompleteTaskDto.mockImplementation(() => mockDto as any);
      MockedTaskService.completeTask.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockTask)
      } as any);

      mockReq.params = { id: '1' };

      await controller.completeTask(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(MockedCompleteTaskDto).toHaveBeenCalledWith('1');
      expect(MockedTaskService.completeTask).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: SUCCESS_MESSAGES.TASK_COMPLETED,
        data: mockTask
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws error', async () => {
      const mockDto = {
        id: 1,
        validate: jest.fn().mockReturnValue({ isValid: true, errors: [] })
      };

      MockedCompleteTaskDto.mockImplementation(() => mockDto as any);
      const error = new NotFoundError('Task not found');
      MockedTaskService.completeTask.mockRejectedValue(error);

      mockReq.params = { id: '1' };

      await controller.completeTask(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTaskById', () => {
    it('should return task by ID successfully', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isCompleted: false,
        createdAt: new Date('2024-01-01T12:00:00Z')
      };

      const mockDto = {
        id: 1,
        validate: jest.fn().mockReturnValue({ isValid: true, errors: [] })
      };

      MockedCompleteTaskDto.mockImplementation(() => mockDto as any);
      MockedTaskService.getTaskById.mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockTask)
      } as any);

      mockReq.params = { id: '1' };

      await controller.getTaskById(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(MockedCompleteTaskDto).toHaveBeenCalledWith('1');
      expect(MockedTaskService.getTaskById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTask
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws error', async () => {
      const mockDto = {
        id: 1,
        validate: jest.fn().mockReturnValue({ isValid: true, errors: [] })
      };

      MockedCompleteTaskDto.mockImplementation(() => mockDto as any);
      const error = new NotFoundError('Task not found');
      MockedTaskService.getTaskById.mockRejectedValue(error);

      mockReq.params = { id: '1' };

      await controller.getTaskById(mockReq as ExpressRequest, mockRes as ExpressResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
