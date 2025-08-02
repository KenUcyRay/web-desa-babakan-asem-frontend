import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { AxiosError } from "axios";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: error,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else if (error instanceof AxiosError) {
    res.status(error.response?.status || 500).json({
      errors:
        error.response?.data.error ||
        "An error occurred while processing your request.",
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
