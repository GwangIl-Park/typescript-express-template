import { HttpException } from '@/exception/httpException';
import { IAccount } from '@/interface/account.interface';
import { AccountModel } from '@/model/account.model';

export default class AccountRepository {
  public createAccount = async(account:IAccount) => {
    try {
      const findAccount = await AccountModel.findOne({address:account.address});
      if(findAccount) {
        throw new HttpException(400, `${findAccount.address} is already registered`);
      }
      await AccountModel.create(account);
    } catch(error) {
      throw error;
    }
  }
  
  public findAllAccount = async():Promise<IAccount[]> => {
    try {
      const accountList = await AccountModel.find({});
      return accountList;
    } catch(error) {
      throw error;
    }
  }

  public deleteAccount = async(account:IAccount) => {
    try {
      const deleteAccount = await AccountModel.findOneAndDelete(account);
      if(!deleteAccount) {
        throw new HttpException(400, "Account does not exists");
      }
    } catch(error) {
      throw error;
    }
  }
}