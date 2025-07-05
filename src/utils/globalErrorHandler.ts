import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';

export class CustomError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Prisma error: unique constraint failed
const handleUniqueConstraintError = (
  err: PrismaClientKnownRequestError,
  model = 'Resource'
): CustomError => {
  const meta = err.meta as any;
  const target = meta?.target?.join(', ') ?? 'field(s)';
  const message = `${target} already exists. Please use another ${target}.`;
  return new CustomError(message, 400);
};

// Prisma error: validation error (wrong types or null where not allowed)
const handleValidationError = (
  err: PrismaClientValidationError
): CustomError => {
  return new CustomError(
    'Invalid input data. Please check your fields.',
    400
  );
};

const handleProdError = (res: Response, error: any): void => {
  if (error.isOperational) {
    res.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  } else {
    console.error('ERROR 💥:', error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong! Please try again later.',
    });
  }
};

const handleDevError = (res: Response, error: any): void => {
  res.status(error.statusCode || 500).send({
    success: false,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
  model?: string
): void => {

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    if (error.code === 'P2002') {
      error = handleUniqueConstraintError(error, model);
    }

    if (error instanceof PrismaClientValidationError) {
      error = handleValidationError(error);
    }

    handleDevError(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.code === 'P2002') {
      error = handleUniqueConstraintError(error, model);
    }

    if (error instanceof PrismaClientValidationError) {
      error = handleValidationError(error);
    }

    handleProdError(res, error);
  }
};

export default globalErrorHandler;
