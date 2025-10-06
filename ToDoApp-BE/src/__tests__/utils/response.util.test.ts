import { ResponseUtil } from '../../utils/response.util.js';
import { HTTP_STATUS } from '../../common/index.js';
import { type Response } from 'express';

describe('ResponseUtil', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('success', () => {
    it('should send success response with data and default status', () => {
      const data = { id: 1, name: 'Test' };
      const result = ResponseUtil.success(mockRes as Response, data);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data
      });
      expect(result).toBe(mockRes);
    });

    it('should send success response with data and custom status', () => {
      const data = { id: 1, name: 'Test' };
      const result = ResponseUtil.success(mockRes as Response, data, undefined, HTTP_STATUS.CREATED);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data
      });
      expect(result).toBe(mockRes);
    });

    it('should send success response with data and message', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Operation successful';
      const result = ResponseUtil.success(mockRes as Response, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
        message
      });
      expect(result).toBe(mockRes);
    });

    it('should send success response with data, message, and custom status', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Resource created';
      const result = ResponseUtil.success(mockRes as Response, data, message, HTTP_STATUS.CREATED);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
        message
      });
      expect(result).toBe(mockRes);
    });

    it('should handle null data', () => {
      const result = ResponseUtil.success(mockRes as Response, null);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: null
      });
      expect(result).toBe(mockRes);
    });

    it('should handle undefined data', () => {
      const result = ResponseUtil.success(mockRes as Response, undefined);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: undefined
      });
      expect(result).toBe(mockRes);
    });

    it('should handle empty string message', () => {
      const data = { id: 1 };
      const result = ResponseUtil.success(mockRes as Response, data, '');

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
        message: ''
      });
    });
  });

  describe('error', () => {
    it('should send error response with default status', () => {
      const message = 'Something went wrong';
      const result = ResponseUtil.error(mockRes as Response, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }
      });
      expect(result).toBe(mockRes);
    });

    it('should send error response with custom status', () => {
      const message = 'Not found';
      const result = ResponseUtil.error(mockRes as Response, message, HTTP_STATUS.NOT_FOUND);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          statusCode: HTTP_STATUS.NOT_FOUND
        }
      });
      expect(result).toBe(mockRes);
    });

    it('should handle empty error message', () => {
      const result = ResponseUtil.error(mockRes as Response, '');

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: '',
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }
      });
    });

    it('should handle various HTTP status codes', () => {
      const message = 'Bad request';
      const statusCodes = [
        HTTP_STATUS.BAD_REQUEST,
        HTTP_STATUS.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN,
        HTTP_STATUS.NOT_FOUND,
        HTTP_STATUS.CONFLICT,
        HTTP_STATUS.UNPROCESSABLE_ENTITY
      ];

      statusCodes.forEach(statusCode => {
        jest.clearAllMocks();
        ResponseUtil.error(mockRes as Response, message, statusCode);

        expect(mockRes.status).toHaveBeenCalledWith(statusCode);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          error: {
            message,
            statusCode
          }
        });
      });
    });
  });

  describe('created', () => {
    it('should send created response with data', () => {
      const data = { id: 1, name: 'New Resource' };
      const result = ResponseUtil.created(mockRes as Response, data);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data
      });
      expect(result).toBe(mockRes);
    });

    it('should send created response with data and message', () => {
      const data = { id: 1, name: 'New Resource' };
      const message = 'Resource created successfully';
      const result = ResponseUtil.created(mockRes as Response, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
        message
      });
      expect(result).toBe(mockRes);
    });

    it('should handle null data in created response', () => {
      const result = ResponseUtil.created(mockRes as Response, null);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: null
      });
    });
  });

  describe('noContent', () => {
    it('should send no content response', () => {
      const result = ResponseUtil.noContent(mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
      expect(mockRes.send).toHaveBeenCalledWith();
      expect(result).toBe(mockRes);
    });

    it('should not call json method for no content', () => {
      ResponseUtil.noContent(mockRes as Response);

      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('method chaining', () => {
    it('should support method chaining for success response', () => {
      const data = { id: 1 };
      const result = ResponseUtil.success(mockRes as Response, data);

      expect(result).toBe(mockRes);
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should support method chaining for error response', () => {
      const result = ResponseUtil.error(mockRes as Response, 'Error');

      expect(result).toBe(mockRes);
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should support method chaining for created response', () => {
      const data = { id: 1 };
      const result = ResponseUtil.created(mockRes as Response, data);

      expect(result).toBe(mockRes);
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should support method chaining for no content response', () => {
      const result = ResponseUtil.noContent(mockRes as Response);

      expect(result).toBe(mockRes);
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.send).toHaveBeenCalled();
    });
  });
});
