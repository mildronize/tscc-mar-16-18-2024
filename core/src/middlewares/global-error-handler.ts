import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { BaseResponse } from '../response';

export function globalErrorHanlder(
  error: unknown,
  request: Request,
  response: Response<BaseResponse>,
  next: NextFunction
) {
  let statusCode = 500;
  let message = '';

  if(error instanceof HttpError) {
    statusCode = error.statusCode;
  }

  if(error instanceof Error) {
    console.error(`${error.name}: ${error.message}`);
    message = error.message;
  } else {
    console.error('An unknown error occurred');
    message = `An unknown error occurred, ${String(error)}`;
  }

  response.status(statusCode).send({
    message,
    success: false,
    data: null,
    traceStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
  });

}

