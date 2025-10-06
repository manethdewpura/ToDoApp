import { AppError, NotFoundError, ValidationError, DatabaseError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.constant.js';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create AppError with default values', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
      expect(error.stack).toBeDefined();
    });

    it('should create AppError with custom status code', () => {
      const error = new AppError('Test error', 422);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(422);
      expect(error.isOperational).toBe(true);
    });

    it('should create AppError with custom isOperational flag', () => {
      const error = new AppError('Test error', 500, false);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
    });

    it('should create AppError with all custom values', () => {
      const error = new AppError('Custom error', 400, false);

      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(false);
    });
  });

  describe('inheritance', () => {
    it('should be instance of Error', () => {
      const error = new AppError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should have correct prototype chain', () => {
      const error = new AppError('Test error');

      expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(error))).toBe(Error.prototype);
    });
  });

  describe('stack trace', () => {
    it('should capture stack trace', () => {
      const error = new AppError('Test error');

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('AppError');
    });

    it('should capture stack trace at correct location', () => {
      function createError() {
        return new AppError('Test error');
      }

      const error = createError();

      expect(error.stack).toContain('createError');
    });
  });

  describe('message handling', () => {
    it('should handle empty message', () => {
      const error = new AppError('');

      expect(error.message).toBe('');
      expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it('should handle long message', () => {
      const longMessage = 'a'.repeat(1000);
      const error = new AppError(longMessage);

      expect(error.message).toBe(longMessage);
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const error = new AppError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });
  });

  describe('status code validation', () => {
    it('should accept valid HTTP status codes', () => {
      const validStatusCodes = [200, 201, 400, 401, 403, 404, 422, 500, 502, 503];
      
      validStatusCodes.forEach(statusCode => {
        const error = new AppError('Test error', statusCode);
        expect(error.statusCode).toBe(statusCode);
      });
    });

    it('should accept edge case status codes', () => {
      const edgeCases = [0, 1, 999, 1000];
      
      edgeCases.forEach(statusCode => {
        const error = new AppError('Test error', statusCode);
        expect(error.statusCode).toBe(statusCode);
      });
    });
  });
});

describe('NotFoundError', () => {
  it('should create NotFoundError with correct default values', () => {
    const error = new NotFoundError('Resource not found');

    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('NotFoundError');
  });

  it('should be instance of AppError', () => {
    const error = new NotFoundError('Resource not found');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should handle empty message', () => {
    const error = new NotFoundError('');

    expect(error.message).toBe('');
    expect(error.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
  });

  it('should handle various message types', () => {
    const messages = [
      'User not found',
      'Task with ID 123 not found',
      'Resource not available',
      '404 - Not Found'
    ];

    messages.forEach(message => {
      const error = new NotFoundError(message);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    });
  });
});

describe('ValidationError', () => {
  it('should create ValidationError with correct default values', () => {
    const error = new ValidationError('Invalid input data');

    expect(error.message).toBe('Invalid input data');
    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('ValidationError');
  });

  it('should be instance of AppError', () => {
    const error = new ValidationError('Invalid input data');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should handle validation messages', () => {
    const messages = [
      'Title is required',
      'Invalid email format',
      'Password must be at least 8 characters',
      'Age must be a positive number'
    ];

    messages.forEach(message => {
      const error = new ValidationError(message);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  });

  it('should handle multiple validation errors', () => {
    const error = new ValidationError('Title is required, Description is required');

    expect(error.message).toBe('Title is required, Description is required');
    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});

describe('DatabaseError', () => {
  it('should create DatabaseError with correct default values', () => {
    const error = new DatabaseError('Database connection failed');

    expect(error.message).toBe('Database connection failed');
    expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('DatabaseError');
  });

  it('should be instance of AppError', () => {
    const error = new DatabaseError('Database connection failed');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(DatabaseError);
  });

  it('should handle database error messages', () => {
    const messages = [
      'Connection timeout',
      'Query execution failed',
      'Transaction rollback required',
      'Database schema mismatch'
    ];

    messages.forEach(message => {
      const error = new DatabaseError(message);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  it('should handle SQL error messages', () => {
    const error = new DatabaseError('SQL Error: syntax error at or near "SELECT"');

    expect(error.message).toBe('SQL Error: syntax error at or near "SELECT"');
    expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });
});

describe('Error class hierarchy', () => {
  it('should have correct inheritance chain for NotFoundError', () => {
    const error = new NotFoundError('Test');
    
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof NotFoundError).toBe(true);
    expect(error instanceof ValidationError).toBe(false);
    expect(error instanceof DatabaseError).toBe(false);
  });

  it('should have correct inheritance chain for ValidationError', () => {
    const error = new ValidationError('Test');
    
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof ValidationError).toBe(true);
    expect(error instanceof NotFoundError).toBe(false);
    expect(error instanceof DatabaseError).toBe(false);
  });

  it('should have correct inheritance chain for DatabaseError', () => {
    const error = new DatabaseError('Test');
    
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof DatabaseError).toBe(true);
    expect(error instanceof NotFoundError).toBe(false);
    expect(error instanceof ValidationError).toBe(false);
  });
});

describe('Error properties', () => {
  it('should have readonly properties', () => {
    const error = new AppError('Test', 400, true);
    
    // These should not throw errors when accessed
    expect(() => error.message).not.toThrow();
    expect(() => error.statusCode).not.toThrow();
    expect(() => error.isOperational).not.toThrow();
    expect(() => error.name).not.toThrow();
    expect(() => error.stack).not.toThrow();
  });

  it('should maintain property values after creation', () => {
    const error = new AppError('Test message', 422, false);
    
    // Properties should remain the same
    expect(error.message).toBe('Test message');
    expect(error.statusCode).toBe(422);
    expect(error.isOperational).toBe(false);
  });
});
