import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
export const { NODE_ENV, PORT, LOG_DIR, ORIGIN, CREDENTIALS,
              APPLICATION_NAME, IGNORE_LOG_PATH,
              DB_HOST, DB_PASS, DB_URL, DB_DATABASE,
              KEYSTORE_PATH, PASSWORD, PROVIDER, PROVIDER_TIMEOUT, PROVIDER_CHAIN_ID, PROVIDER_REFERER,
              INITIAL_BALANCE, LOW_BALANCE, RECHARGE_BALANCE,
              CHECK_CYCLE} = process.env;

export const IGNORE_LOG_PATH_LIST = IGNORE_LOG_PATH ? IGNORE_LOG_PATH.split(',') : undefined;
