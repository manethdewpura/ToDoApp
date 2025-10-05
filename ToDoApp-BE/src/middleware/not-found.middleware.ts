import { type Request, type Response } from "express";
import { HTTP_STATUS } from "../common/index.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: HTTP_STATUS.NOT_FOUND,
    },
  });
};

