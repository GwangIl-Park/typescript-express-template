import { IGNORE_LOG_PATH_LIST } from '@/config';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { v1 } from 'uuid';

export const LogMiddleware = (req:Request, res:Response, next:NextFunction) => {
  if(IGNORE_LOG_PATH_LIST.indexOf(req.path) === -1) {
    const requestId = v1();

    res.setHeader("X-Request-ID", requestId);

    const start = Date.now();
    const message = `REQ > [${req.method} ${req.path}],\nheaders=${JSON.stringify(req.headers)},\nparams=${JSON.stringify(req.params)},\nbody=${req.body ? JSON.stringify(req.body) : "{}"}`;

    logger.info({message, requestId});
    
    let body:any;

    const oldSend = res.send;
    res.send = (data) => {
      body = data;
      res.send = oldSend;
      return res.send(data);
    }

    res.on("finish", () => {
      const statusCodeHead = Math.floor(res.statusCode/100);
      if(statusCodeHead === 2 || statusCodeHead === 3) {
        let headers = {};
        res.getHeaderNames().forEach(element => {
          headers[element] = res.getHeader(element);
        });
        const message = `RES > ${res.statusCode} [${req.method} ${req.path}] ${Date.now() - start}ms,\nheaders=${JSON.stringify(headers)},\npayload=${body ? body : "{}"}`;
        logger.info({message, requestId});
      }
    });
  }
  
  next();
}