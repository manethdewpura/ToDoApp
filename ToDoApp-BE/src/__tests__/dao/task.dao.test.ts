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

  describe('findAll', () => {
    it('should find all tasks', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const result = await taskDAO.findAll();

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toBe(mockTasks);
    });

    it('should find all tasks with options', async () => {
      const mockTasks = [mockTask];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const options = {
        where: { is_completed: false },
        order: [['created_at', 'DESC']],
        limit: 5,
      };

      const result = await taskDAO.findAll(options as any);

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith(options);
      expect(result).toBe(mockTasks);
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

  describe('findOne', () => {
    it('should find one task by condition', async () => {
      MockedTaskModel.findOne.mockResolvedValue(mockTask);

      const result = await taskDAO.findOne({ id: 1 });

      expect(MockedTaskModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(mockTask);
    });

    it('should return null when no task matches', async () => {
      MockedTaskModel.findOne.mockResolvedValue(null);

      const result = await taskDAO.findOne({ id: 999 });

      expect(MockedTaskModel.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      mockTask.update.mockResolvedValue(mockTask);

      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const result = await taskDAO.update(mockTask, updateData);

      expect(mockTask.update).toHaveBeenCalledWith(updateData);
      expect(result).toBe(mockTask);
    });

    it('should update task completion status', async () => {
      mockTask.update.mockResolvedValue(mockTask);

      const result = await taskDAO.update(mockTask, { is_completed: true });

      expect(mockTask.update).toHaveBeenCalledWith({ is_completed: true });
      expect(result).toBe(mockTask);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockTask.destroy.mockResolvedValue();

      await taskDAO.delete(mockTask);

      expect(mockTask.destroy).toHaveBeenCalled();
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

  describe('findAllOrderedByDate', () => {
    it('should find all tasks ordered by creation date', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      MockedTaskModel.findAll.mockResolvedValue(mockTasks as any);

      const result = await taskDAO.findAllOrderedByDate();

      expect(MockedTaskModel.findAll).toHaveBeenCalledWith({
        order: [['created_at', 'DESC']],
      });
      expect(result).toBe(mockTasks);
    });
  });

  describe('count', () => {
    it('should count all tasks when no condition provided', async () => {
      MockedTaskModel.count.mockResolvedValue(10);

      const result = await taskDAO.count();

      expect(MockedTaskModel.count).toHaveBeenCalledWith();
      expect(result).toBe(10);
    });

    it('should count tasks by condition', async () => {
      MockedTaskModel.count.mockResolvedValue(5);

      const result = await taskDAO.count({ is_completed: false });

      expect(MockedTaskModel.count).toHaveBeenCalledWith({ where: { is_completed: false } });
      expect(result).toBe(5);
    });
  });

  describe('exists', () => {
    it('should return true when task exists', async () => {
      MockedTaskModel.count.mockResolvedValue(1);

      const result = await taskDAO.exists(1);

      expect(MockedTaskModel.count).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });

    it('should return false when task does not exist', async () => {
      MockedTaskModel.count.mockResolvedValue(0);

      const result = await taskDAO.exists(999);

      expect(MockedTaskModel.count).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBe(false);
    });
  });
});


