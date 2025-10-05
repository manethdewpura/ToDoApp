import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../common/index.js";
import { HTTP_STATUS } from "../common/index.js";

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    stack?: string;
  };
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error values
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";

  // Check if it's an operational error (AppError)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

