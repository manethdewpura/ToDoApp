import { TaskDAO } from '../../dao/task.dao.js';
import { TaskModel } from '../../models/task.model.js';

// Mock the TaskModel
jest.mock('../../models/task.model.js');

const MockedTaskModel = TaskModel as jest.Mocked<typeof TaskModel>;

describe('TaskDAO', () => {
  let taskDAO: TaskDAO;
  let mockTask: jest.Mocked<TaskModel>;

  beforeEach(() => {
    jest.clearAllMocks();
    taskDAO = new TaskDAO();

    // Create a mock task instance
    mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      is_completed: false,
      created_at: new Date('2024-01-01T12:00:00Z'),
      save: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      isCompleted: jest.fn(),
    } as any;
  });

  describe('create', () => {
    it('should create a new task', async () => {
      MockedTaskModel.create.mockResolvedValue(mockTask);

      const result = await taskDAO.create({
        title: 'New Task',
        description: 'New Description',
      });

      expect(MockedTaskModel.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
      });
      expect(result).toBe(mockTask);
    });

    it('should create a task with is_completed flag', async () => {
      MockedTaskModel.create.mockResolvedValue(mockTask);

      const result = await taskDAO.create({
        title: 'New Task',
        description: 'New Description',
        is_completed: true,
      });

      expect(MockedTaskModel.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        is_completed: true,
      });
      expect(result).toBe(mockTask);
    });
  });

  describe('findById', () => {
    it('should find a task by ID', async () => {
      MockedTaskModel.findByPk.mockResolvedValue(mockTask);

      const result = await taskDAO.findById(1);

      expect(MockedTaskModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(mockTask);
    });

    it('should return null when task not found', async () => {
      MockedTaskModel.findByPk.mockResolvedValue(null);

      const result = await taskDAO.findById(999);

      expect(MockedTaskModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('findWhere', () => {
    it('should find tasks by where condition', async () => {
      const mockTasks = [mockTask];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const result = await taskDAO.findWhere({ is_completed: false });

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith({
        where: { is_completed: false },
      });
      expect(result).toBe(mockTasks);
    });

    it('should find tasks by where condition with additional options', async () => {
      const mockTasks = [mockTask];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const result = await taskDAO.findWhere(
        { is_completed: false },
        {
          order: [['created_at', 'DESC']],
          limit: 10,
        } as any
      );

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith({
        where: { is_completed: false },
        order: [['created_at', 'DESC']],
        limit: 10,
      });
      expect(result).toBe(mockTasks);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a task as completed', async () => {
      mockTask.save.mockResolvedValue(mockTask);

      const result = await taskDAO.markAsCompleted(mockTask);

      expect(mockTask.is_completed).toBe(true);
      expect(mockTask.save).toHaveBeenCalled();
      expect(result).toBe(mockTask);
    });
  });

  describe('findRecentNonCompleted', () => {
    it('should find recent non-completed tasks with default limit', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const result = await taskDAO.findRecentNonCompleted();

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith({
        where: { is_completed: false },
        order: [['created_at', 'DESC']],
        limit: 5,
      });
      expect(result).toBe(mockTasks);
    });

    it('should find recent non-completed tasks with custom limit', async () => {
      const mockTasks = [mockTask];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const result = await taskDAO.findRecentNonCompleted(10);

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith({
        where: { is_completed: false },
        order: [['created_at', 'DESC']],
        limit: 10,
      });
      expect(result).toBe(mockTasks);
    });
  });

  });

