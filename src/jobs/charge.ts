import { AccountService } from '@/service/account.service';
import Container from 'typedi';
import { INITIAL_BALANCE, LOW_BALANCE, RECHARGE_BALANCE } from '@/config';
import { ethers } from 'ethers';
import EthersWallet from '@/loader/ethersWallet';
import { logger } from '@/utils/logger';

const INITIAL_BALANCE_WEI = ethers.utils.parseEther(INITIAL_BALANCE);
const LOW_BALANCE_WEI = ethers.utils.parseEther(LOW_BALANCE);
const RECHARGE_BALANCE_WEI = ethers.utils.parseEther(RECHARGE_BALANCE);

const BIGNUMBER_ZERO = ethers.BigNumber.from(0);

export default class Charger {
  private accountService:AccountService = Container.get(AccountService);
  private ethersWallet:EthersWallet = Container.get(EthersWallet);

  private chargeToAccount = async(account:string, chargeBalance:ethers.BigNumberish) => {
    try {
      let tx:ethers.providers.TransactionRequest = {
        to:account,
        value:chargeBalance
      }

      await this.ethersWallet.sendTransaction(tx);

      logger.info(`chargeToAccount > account=${account} value:${chargeBalance}`);

    } catch(error) {
      throw error;
    }
  }

  private getChargeBalance = async(account:string):Promise<ethers.BigNumberish> => {
    try {
      const currentBalance = await this.ethersWallet.getBalance(account);
      if(currentBalance.eq(BIGNUMBER_ZERO)) {
        return INITIAL_BALANCE_WEI;
      } else if(currentBalance.lt(LOW_BALANCE_WEI)) {
        return RECHARGE_BALANCE_WEI;
      } else {
        return 0;
      }
    } catch(error) {
      throw error;
    }
  }
  
  public chargeLoop = async() => {
    try {
      const accountList = await this.accountService.getAllAccountAddress();
      for(const account of accountList) {
        const chargeBalance = await this.getChargeBalance(account);
        if(chargeBalance) {
          await this.chargeToAccount(account, chargeBalance);
        }
      }
    } catch(error) {
      logger.error(`chargeLoop error > ${error.stack}`);
    }
  }
}