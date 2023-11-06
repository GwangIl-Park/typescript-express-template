import { IAccount } from '@/interface/account.interface';
import Container, { Service } from 'typedi';
import AccountRepository from '@/repository/account.repository';
import { HttpException } from '@/exception/httpException';
import { isAddress } from '@/utils/ethersUtils';

@Service()
export class AccountService {
  private accountRepository:AccountRepository = Container.get(AccountRepository);

  public registerAccount = async(address:string) => {
    try {
      if(!isAddress(address))  {
        throw new HttpException(400, "Invalid Address");
      }
      
      await this.accountRepository.createAccount({address} as IAccount);
    } catch(error) {
      throw error;
    }
  }

  public getAllAccountAddress = async():Promise<string[]> => {
    try {
      const accountList = await this.accountRepository.findAllAccount();
      const accountAddressList:string[] = [];
      accountList.forEach(account => {
        accountAddressList.push(account.address);
      });
      return accountAddressList;
    } catch(error) {
      throw error;
    }
  }

  public deleteAccount = async(address:string) => {
    try {
      if(!isAddress(address)) {
        throw new HttpException(400, "Invalid Address");
      }

      await this.accountRepository.deleteAccount({address} as IAccount);
    } catch(error) {
      throw error;
    }
  }
}