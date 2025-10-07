import { validateRequestBody } from '../../middleware/validate-request.middleware.js';
import { ValidationError } from '../../common/index.js';
import { type Request, type Response, type NextFunction } from 'express';

describe('validateRequestBody middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {}
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('with single required field', () => {
    it('should call next() when required field is present', () => {
      const middleware = validateRequestBody(['title']);
      mockReq.body = { title: 'Test Title' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should throw ValidationError when required field is missing', () => {
      const middleware = validateRequestBody(['title']);
      mockReq.body = { description: 'Test Description' };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when required field is empty string', () => {
      const middleware = validateRequestBody(['title']);
      mockReq.body = { title: '' };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when required field is null', () => {
      const middleware = validateRequestBody(['title']);
      mockReq.body = { title: null };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when required field is undefined', () => {
      const middleware = validateRequestBody(['title']);
      mockReq.body = { title: undefined };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('with multiple required fields', () => {
    it('should call next() when all required fields are present', () => {
      const middleware = validateRequestBody(['title', 'description']);
      mockReq.body = { 
        title: 'Test Title', 
        description: 'Test Description' 
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should throw ValidationError when one field is missing', () => {
      const middleware = validateRequestBody(['title', 'description']);
      mockReq.body = { title: 'Test Title' };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when multiple fields are missing', () => {
      const middleware = validateRequestBody(['title', 'description', 'status']);
      mockReq.body = { extra: 'value' };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should include all missing fields in error message', () => {
      const middleware = validateRequestBody(['title', 'description', 'status']);
      mockReq.body = { extra: 'value' };

      try {
        middleware(mockReq as Request, mockRes as Response, mockNext);
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        const err = error as ValidationError;
        expect(err).toBeInstanceOf(ValidationError);
        expect(err.message).toContain('Missing required fields: title, description, status');
      }

      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('with no required fields', () => {
    it('should call next() when no fields are required', () => {
      const middleware = validateRequestBody([]);
      mockReq.body = {};

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('with falsy values', () => {
    it('should throw ValidationError for 0', () => {
      const middleware = validateRequestBody(['count']);
      mockReq.body = { count: 0 };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for false', () => {
      const middleware = validateRequestBody(['isActive']);
      mockReq.body = { isActive: false };

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ValidationError);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() for truthy values', () => {
      const middleware = validateRequestBody(['count', 'isActive']);
      mockReq.body = { count: 1, isActive: true };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('error message format', () => {
    it('should format single missing field correctly', () => {
      const middleware = validateRequestBody(['title']);
      mockReq.body = {};

      try {
        middleware(mockReq as Request, mockRes as Response, mockNext);
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        const err = error as ValidationError;
        expect(err).toBeInstanceOf(ValidationError);
        expect(err.message).toBe('Missing required fields: title');
      }
    });

    it('should format multiple missing fields correctly', () => {
      const middleware = validateRequestBody(['title', 'description']);
      mockReq.body = {};

      try {
        middleware(mockReq as Request, mockRes as Response, mockNext);
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        const err = error as ValidationError;
        expect(err).toBeInstanceOf(ValidationError);
        expect(err.message).toBe('Missing required fields: title, description');
      }
    });
  });
});
