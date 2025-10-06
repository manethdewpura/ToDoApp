import { CreateTaskDto, TaskResponseDto, CompleteTaskDto } from '../../dtos/task.dto.js';
import { type ITask } from '../../interfaces/task.interface.js';

describe('CreateTaskDto', () => {
  describe('constructor', () => {
    it('should trim whitespace from title and description', () => {
      const dto = new CreateTaskDto('  Test Title  ', '  Test Description  ');
      
      expect(dto.title).toBe('Test Title');
      expect(dto.description).toBe('Test Description');
    });
  });

  describe('validate()', () => {
    it('should return valid for correct data', () => {
      const dto = new CreateTaskDto('Valid Title', 'Valid Description');
      const result = dto.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for empty title', () => {
      const dto = new CreateTaskDto('', 'Valid Description');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required and must be a non-empty string');
    });

    it('should return invalid for whitespace-only title', () => {
      const dto = new CreateTaskDto('   ', 'Valid Description');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required and must be a non-empty string');
    });

    it('should return invalid for title exceeding 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      const dto = new CreateTaskDto(longTitle, 'Valid Description');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must not exceed 255 characters');
    });

    it('should return invalid for empty description', () => {
      const dto = new CreateTaskDto('Valid Title', '');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required and must be a non-empty string');
    });

    it('should return invalid for whitespace-only description', () => {
      const dto = new CreateTaskDto('Valid Title', '   ');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required and must be a non-empty string');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const dto = new CreateTaskDto('', '');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Title is required and must be a non-empty string');
      expect(result.errors).toContain('Description is required and must be a non-empty string');
    });

    it('should return valid for title exactly 255 characters', () => {
      const title = 'a'.repeat(255);
      const dto = new CreateTaskDto(title, 'Valid Description');
      const result = dto.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('TaskResponseDto', () => {
  const mockTask: ITask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    is_completed: false,
    created_at: new Date('2024-01-01T12:00:00Z')
  };

  describe('constructor', () => {
    it('should create DTO from task interface', () => {
      const dto = new TaskResponseDto(mockTask);

      expect(dto.id).toBe(1);
      expect(dto.title).toBe('Test Task');
      expect(dto.description).toBe('Test Description');
      expect(dto.isCompleted).toBe(false);
      expect(dto.createdAt).toEqual(new Date('2024-01-01T12:00:00Z'));
    });

    it('should handle completed task', () => {
      const completedTask: ITask = {
        ...mockTask,
        is_completed: true
      };
      const dto = new TaskResponseDto(completedTask);

      expect(dto.isCompleted).toBe(true);
    });
  });

  describe('fromTaskArray()', () => {
    it('should create array of DTOs from task array', () => {
      const tasks: ITask[] = [
        mockTask,
        { ...mockTask, id: 2, title: 'Second Task' }
      ];

      const dtos = TaskResponseDto.fromTaskArray(tasks);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TaskResponseDto);
      expect(dtos[0].id).toBe(1);
      expect(dtos[1]).toBeInstanceOf(TaskResponseDto);
      expect(dtos[1].id).toBe(2);
    });

    it('should handle empty array', () => {
      const dtos = TaskResponseDto.fromTaskArray([]);

      expect(dtos).toHaveLength(0);
    });
  });
});

describe('CompleteTaskDto', () => {
  describe('constructor', () => {
    it('should parse string ID to number', () => {
      const dto = new CompleteTaskDto('123');
      expect(dto.id).toBe(123);
    });

    it('should handle numeric ID', () => {
      const dto = new CompleteTaskDto(456);
      expect(dto.id).toBe(456);
    });

    it('should handle negative string', () => {
      const dto = new CompleteTaskDto('-123');
      expect(dto.id).toBe(-123);
    });
  });

  describe('validate()', () => {
    it('should return valid for positive integer', () => {
      const dto = new CompleteTaskDto('123');
      const result = dto.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for numeric positive integer', () => {
      const dto = new CompleteTaskDto(456);
      const result = dto.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for NaN', () => {
      const dto = new CompleteTaskDto('invalid');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid task ID');
    });

    it('should return invalid for zero', () => {
      const dto = new CompleteTaskDto('0');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid task ID');
    });

    it('should return invalid for negative number', () => {
      const dto = new CompleteTaskDto('-1');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid task ID');
    });

    it('should return invalid for empty string', () => {
      const dto = new CompleteTaskDto('');
      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid task ID');
    });
  });
});
