import { AccountService } from '@/service/account.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class AccountController {
  private accountService:AccountService = Container.get(AccountService);

  public registerAccount = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const address = req.params.address;
      const result = await this.accountService.registerAccount(address);
      res.status(200).json(result);
    } catch(error) {
      next(error);
    }
  }

  public deleteAccount = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const address = req.params.address;
      const result = await this.accountService.deleteAccount(address);
      res.status(200).json({result});
    } catch(error) {
      next(error);
    }
  } 
}