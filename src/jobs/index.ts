import { CHECK_CYCLE } from '@/config';
import { logger } from '@/utils/logger';
import Charger from './charge';

const CHECK_CYCLE_MS = Number(CHECK_CYCLE) * 1000;

export default() => {
  const charger = new Charger();
  
  setInterval(charger.chargeLoop, CHECK_CYCLE_MS);
  logger.info(`checkTransactionLoop start`);
}