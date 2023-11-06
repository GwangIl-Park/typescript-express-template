import accountRouter from './account.router';
import healthCheckRouter from './healthCheck.router';
import { Router } from 'express';

export default () => {
  const app = Router();
  accountRouter(app);
  healthCheckRouter(app);
  
  return app;
}