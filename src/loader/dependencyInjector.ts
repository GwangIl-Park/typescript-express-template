import 'reflect-metadata'
import Container from 'typedi';
import EthersWallet from './ethersWallet';
import AccountRepository from '@/repository/account.repository';
import { KEYSTORE_PATH, PASSWORD, PROVIDER, PROVIDER_TIMEOUT, PROVIDER_CHAIN_ID, PROVIDER_REFERER } from '@/config';

const PROVIDER_TIMEOUT_MS = Number(PROVIDER_TIMEOUT) * 1000;
const PROVIDER_CHAIN_ID_NUMBER = Number(PROVIDER_CHAIN_ID);

export default () => {
  Container.set(EthersWallet, new EthersWallet(PROVIDER.split(','), PROVIDER_TIMEOUT_MS, PROVIDER_CHAIN_ID_NUMBER, PROVIDER_REFERER, KEYSTORE_PATH, PASSWORD));
  Container.set(AccountRepository, new AccountRepository());
}