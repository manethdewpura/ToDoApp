import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { type Request, type Response, type NextFunction } from 'express';

describe('asyncHandler middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call the async function and pass through successful execution', async () => {
    const asyncFn = jest.fn().mockResolvedValue(undefined);
    const wrappedFn = asyncHandler(asyncFn);

    wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    // Wait for the promise to resolve
    await new Promise(resolve => setImmediate(resolve));

    expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should catch errors and pass them to next', async () => {
    const error = new Error('Async error');
    const asyncFn = jest.fn().mockRejectedValue(error);
    const wrappedFn = asyncHandler(asyncFn);

    wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    // Wait for the promise to resolve
    await new Promise(resolve => setImmediate(resolve));

    expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle promise rejection with custom error', async () => {
    const customError = new Error('Custom async error');
    const asyncFn = jest.fn().mockRejectedValue(customError);
    const wrappedFn = asyncHandler(asyncFn);

    wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    // Wait for the promise to resolve
    await new Promise(resolve => setImmediate(resolve));

    expect(mockNext).toHaveBeenCalledWith(customError);
  });

  it('should handle multiple async calls independently', async () => {
    const asyncFn1 = jest.fn().mockResolvedValue(undefined);
    const asyncFn2 = jest.fn().mockRejectedValue(new Error('Error 2'));
    const wrappedFn1 = asyncHandler(asyncFn1);
    const wrappedFn2 = asyncHandler(asyncFn2);

    const mockNext1 = jest.fn();
    const mockNext2 = jest.fn();

    wrappedFn1(mockReq as Request, mockRes as Response, mockNext1);
    wrappedFn2(mockReq as Request, mockRes as Response, mockNext2);

    // Wait for both promises to resolve
    await new Promise(resolve => setImmediate(resolve));

    expect(asyncFn1).toHaveBeenCalled();
    expect(asyncFn2).toHaveBeenCalled();
    expect(mockNext1).not.toHaveBeenCalled();
    expect(mockNext2).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should preserve the original function context', async () => {
    class TestController {
      async method(req: Request, res: Response, next: NextFunction) {
        expect(this).toBeInstanceOf(TestController);
        return Promise.resolve();
      }
    }

    const controller = new TestController();
    const wrappedMethod = asyncHandler(controller.method.bind(controller));

    wrappedMethod(mockReq as Request, mockRes as Response, mockNext);

    // Wait for the promise to resolve
    await new Promise(resolve => setImmediate(resolve));

    expect(mockNext).not.toHaveBeenCalled();
  });
});
