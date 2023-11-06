import { ValidateEnv } from './utils/validateEnv';
import loader from './loader';
import express from 'express';
import { PORT } from './config';
import { logger } from './utils/logger';
import { sleep } from './utils/etcUtils';

async function start() {
  ValidateEnv();

  const app = express();
  
  await loader({expressApp: app});

  app.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
  }).on('error', async(error) => {
    logger.error(`Server listen error > ${error.stack}`);
    await sleep(1000);
    process.exit(1);
  });
}

start();