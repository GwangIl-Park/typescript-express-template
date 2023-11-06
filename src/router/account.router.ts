import { Router } from 'express';
import { AccountController } from '@/controller/account.controller';

const router = Router();
export default (app:Router) => {
  app.use('/account', router);

  const accountController = new AccountController();
  router.post(`/:address`, accountController.registerAccount);
  router.delete(`/:address`, accountController.deleteAccount);
}
