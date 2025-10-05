import { type Request, type Response, type NextFunction } from "express";

export type ExpressRequest = Request;
export type ExpressResponse = Response;
export type ExpressNextFunction = NextFunction;

export type AsyncRequestHandler = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => Promise<void>;

