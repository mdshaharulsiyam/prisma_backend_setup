import { NextFunction, Request, Response } from "express";
export class CustomError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}





const handleProdError = (res: Response, error: any): void => {
  if (error.isOperational) {
    res.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  } else {
    console.error("ERROR 💥:", error);
    res.status(error.statusCode || 500).send({
      success: false,
      message: error.message || "Something went wrong! Please try again later.",
    });
  }
};

const handleDevError = (res: Response, error: any): void => {
  res.status(error.statusCode).send({
    success: false,
    message: error.message,
    error: error,
  });
};


const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
  model?: string,
): void => {

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  console.log("this a error  ", error);
  if (process.env.NODE_ENV === "development") {
    handleDevError(res, error);
  } else if (process.env.NODE_ENV === "production") {
    handleProdError(res, error);
  }
};

export default globalErrorHandler;
