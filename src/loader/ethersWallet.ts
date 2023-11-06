import { ethers } from 'ethers';
import fs from 'fs';
import { logger } from '../utils/logger';
import { sleep } from '@/utils/etcUtils';

export default class EthersWallet {
  private urlIndex:number;
  private urlList:string[];
  private provider:ethers.providers.BaseProvider;
  private timeout:number;
  private chainId:number;
  private referer:string;

  private wallet:ethers.Wallet;

  constructor(urlList:string[], timeout:number, chainId:number, referer:string, keystorePath:string, password:string) {
    this.urlIndex = 0;
    this.urlList = [...urlList];
    this.timeout = timeout;
    this.chainId = chainId;
    this.referer = referer;

    this.initProvider();
    this.initWallet(keystorePath, password);
  }

  private initProvider = () => {
    try {
      this.setProvider();
      logger.info(`initProvider > url : ${this.urlList[this.urlIndex]}`);
    } catch(error) {
      logger.error(`initProvider error > ${error.stack}`);
      sleep(1000).then(()=> {
        process.exit(1);
      });
    }
  }

  private initWallet = async(keystorePath:string, password:string) => {
    try {
      const keystore = fs.readFileSync(keystorePath, "utf-8");

      const ethersWallet = ethers.Wallet.fromEncryptedJsonSync(keystore, password);
      this.wallet = ethersWallet.connect(this.provider);
      logger.info(`initWallet > address : ${this.wallet.address}`);
    } catch(error) {
      logger.error(`initWallet error > ${error.stack}`);
      sleep(1000).then(()=> {
        process.exit(1);
      });
    }
  }

  private setProvider = () => {
    try {
      const connection:ethers.utils.ConnectionInfo = {url:this.urlList[this.urlIndex], timeout:this.timeout};
      if(this.referer) {
        connection.headers = {"Referer":this.referer, "Origin":this.referer};
      }
      this.provider = new ethers.providers.StaticJsonRpcProvider(connection, this.chainId);
    } catch(error) {
      throw error;
    }
  }

  private switchProvider = () => {
    try {
      this.urlIndex = this.urlIndex === this.urlList.length - 1 ? 0 : this.urlIndex+1;
      this.setProvider();
      this.wallet = this.wallet.connect(this.provider);
      logger.info(`switchProvider url : ${this.urlList[this.urlIndex]}`);
    } catch(error) {
      throw error;
    }
  }

  private retryRpcPromiseRequest = async(promise:() => Promise<any>, retriesLeft = 2): Promise<any> => {
    try {
      const result = await promise();
      return result;
    } catch (error) {
      if(retriesLeft === 0 || error.code === ethers.errors.TIMEOUT || error.error?.code === ethers.errors.TIMEOUT) {
        logger.error(`retryRpcPromiseRequest function : ${promise} ${error}`);
        return Promise.reject(error);
      }
      logger.info(`retryRpcPromiseRequest: ${retriesLeft} retries left`);
      return this.retryRpcPromiseRequest(promise, retriesLeft - 1);
    }
  }

  private rpcRequest = async(promise:()=>Promise<any>, retriesLeft = this.urlList.length - 1):Promise<any> => {
    try {
      const result = await this.retryRpcPromiseRequest(promise);
      return result;
    } catch(error) {
      if(retriesLeft === 0 || error.code === ethers.errors.TIMEOUT || error.error?.code === ethers.errors.TIMEOUT) {
        return Promise.reject(error);
      }
      this.switchProvider();
      return this.rpcRequest(promise, retriesLeft - 1);
    }
  }

  public getWalletAddress = ():string => {
    return this.wallet.address;
  }

  public sendTransaction = async(tx:ethers.providers.TransactionRequest):Promise<string> => {
    try {
      const result = await this.wallet.sendTransaction(tx);
      return result.hash;
    } catch(error) {
      logger.error(`sendTransaction Error : ${error}`);
      throw error;
    }
  }

  public getBalance = async(address:string):Promise<ethers.BigNumber> => {
    try {
      const balance = await this.rpcRequest(async() => await this.provider.getBalance(address));
      return balance;
    } catch(error) {
      throw error;
    }
  }
}