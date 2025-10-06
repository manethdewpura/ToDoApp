import { HTTP_STATUS } from "../constants/index.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    this.name = 'DatabaseError';
  }
}

