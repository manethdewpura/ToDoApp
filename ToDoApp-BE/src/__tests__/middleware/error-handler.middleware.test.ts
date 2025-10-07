import { errorHandler } from '../../middleware/error-handler.middleware.js';
import { AppError, NotFoundError, ValidationError, DatabaseError } from '../../common/index.js';
import { HTTP_STATUS } from '../../common/index.js';
import { type Request, type Response, type NextFunction } from 'express';

describe('errorHandler middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      path: '/api/tasks',
      method: 'GET'
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    // Mock console.error to avoid noise in tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('AppError handling', () => {
    it('should handle NotFoundError correctly', () => {
      const error = new NotFoundError('Task not found');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', {
        message: 'Task not found',
        stack: error.stack,
        path: '/api/tasks',
        method: 'GET'
      });
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Task not found',
          statusCode: HTTP_STATUS.NOT_FOUND
        }
      });
    });

    it('should handle ValidationError correctly', () => {
      const error = new ValidationError('Invalid input data');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid input data',
          statusCode: HTTP_STATUS.BAD_REQUEST
        }
      });
    });

    it('should handle DatabaseError correctly', () => {
      const error = new DatabaseError('Database connection failed');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Database connection failed',
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }
      });
    });

    it('should handle custom AppError correctly', () => {
      const error = new AppError('Custom error', 422);

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Custom error',
          statusCode: 422
        }
      });
    });
  });

  describe('Generic Error handling', () => {
    it('should handle generic Error correctly', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', {
        message: 'Something went wrong',
        stack: error.stack,
        path: '/api/tasks',
        method: 'GET'
      });
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }
      });
    });

    it('should handle error without stack trace', () => {
      const error = new Error('Error without stack');
      delete error.stack;

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', {
        message: 'Error without stack',
        stack: undefined,
        path: '/api/tasks',
        method: 'GET'
      });
    });
  });

  describe('Environment-specific behavior', () => {
    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          stack: error.stack
        }
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Request information logging', () => {
    it('should log request information correctly', () => {
      const error = new Error('Test error');
      mockReq = { ...mockReq, path: '/api/tasks/123', method: 'POST' };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', {
        message: 'Test error',
        stack: error.stack,
        path: '/api/tasks/123',
        method: 'POST'
      });
    });

    it('should handle missing request properties', () => {
      const error = new Error('Test error');
      mockReq = {}; // Empty request object

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', {
        message: 'Test error',
        stack: error.stack,
        path: undefined,
        method: undefined
      });
    });
  });
});
