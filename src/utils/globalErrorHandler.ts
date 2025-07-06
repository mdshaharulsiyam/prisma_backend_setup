import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod'; // ⬅️ Don't forget this!

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

// Handle Zod schema validation errors
const handleZodError = (err: ZodError): CustomError => {
  // const message = err.errors.map(e => `${e.message}`).join(', ');
  const message = err?.errors?.[0]?.message;
  return new CustomError(`${message}`, 400);
};

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
const handleRequiredConstraintError = (
  message: string
): CustomError => {
  const formattedMessage = `${message?.split(" ")[1]} is required`;
  return new CustomError(formattedMessage, 400);
};

// Prisma error: validation error (wrong types or null where not allowed)
const handleValidationError = (
  err: PrismaClientValidationError
): CustomError => {
  return new CustomError(err.message || 'Invalid input data.', 400);
};


const handleProdError = (res: Response, error: any): void => {
  if (error.isOperational) {
    res.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  } else {
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
    // error: error,
    // stack: error.stack,
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
  const message = error?.message?.split('})')[1]
  // console.log(message)
  console.log(error)
  // 🔍 Development Mode
  if (process.env.NODE_ENV === 'development') {
    if (error instanceof ZodError) {
      error = handleZodError(error);
    }

    if (error.code === 'P2002') {
      error = handleUniqueConstraintError(error, model);
    }

    if (error instanceof PrismaClientValidationError) {
      error = handleValidationError(error);
    }
    if (message?.includes('missing.')) {
      error = handleRequiredConstraintError(message);
    }

    handleDevError(res, error);
  }

  // 🔒 Production Mode
  else if (process.env.NODE_ENV === 'production') {
    if (error instanceof ZodError) {
      error = handleZodError(error);
    }

    if (error.code === 'P2002') {
      error = handleUniqueConstraintError(error, model);
    }

    if (error instanceof PrismaClientValidationError) {
      error = handleValidationError(error);
    }
    if (message?.includes('missing.')) {
      error = handleRequiredConstraintError(message);
    }

    handleProdError(res, error);
  }
};

export default globalErrorHandler;
