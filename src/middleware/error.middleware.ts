import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exception/httpException';
import { logger } from '@utils/logger';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status = error.status || 500;
    const message = `ERR > httpStatus=${status}, errorCode="code", errorType="${error.name}", message="${error.message}",\nstackTrace="${error.stack}"`
    const requestId = res.getHeader("X-Request-ID");
    logger.error({message, requestId});
    res.status(status).json(error.message);
  } catch (error) {
    next(error);
  }
};
