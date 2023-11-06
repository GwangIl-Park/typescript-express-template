import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.path !== '/favicon.ico') {
      const status = 404;
      const error = new Error("Not Found");
      const message = `ERR > httpStatus=${status}, errorCode="code", errorType="${error.name}", message="${error.message}",\nstackTrace="${error.stack}"`

      const requestId = res.getHeader("X-Request-ID");

      logger.error({message, requestId});
      res.status(status).json(error.message);
    }
  } catch (error) {
    next(error);
  }
};
