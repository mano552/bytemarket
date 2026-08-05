import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";
import { createResponse } from "../utils/response";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): void {
  console.error(err.stack);
  res.status(500).json(createResponse<null>(false, null, err.message || "Internal server error"));
}
