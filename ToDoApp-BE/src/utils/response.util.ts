import { type Response } from "express";
import { HTTP_STATUS } from "../common/index.js";

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const response: SuccessResponse<T> = {
      success: true,
      data,
    };

    if (message !== undefined) {
      response.message = message;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ): Response {
    const response: ErrorResponse = {
      success: false,
      error: {
        message,
        statusCode,
      },
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): Response {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

