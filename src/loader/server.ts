import express from 'express';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ORIGIN, CREDENTIALS } from '@config';
import router from '@/router';
import { LogMiddleware } from '@middleware/log.middleware';
import { notFoundMiddleware } from '@/middleware/notFound.middleware';
import { ErrorMiddleware } from '@/middleware/error.middleware';

export default async({app}) => {
  app.use(cors({origin:ORIGIN, credentials:CREDENTIALS === 'true'}));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  app.use(cookieParser());
  app.use(LogMiddleware);

  app.use('/', router());

  app.use(notFoundMiddleware);
  app.use(ErrorMiddleware);
}