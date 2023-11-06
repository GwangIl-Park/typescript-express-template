import { Router } from 'express';

const router = Router();
export default (app:Router) => {
  app.use('/health-check', router);

  router.get(`/`, (req, res) => {
      res.status(200).send();
    });
}