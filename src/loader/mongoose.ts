import mongoose from 'mongoose';
import { DB_HOST, DB_PASS, DB_URL, DB_DATABASE } from '@/config';
import { logger } from '@/utils/logger';
import { sleep } from '@/utils/etcUtils';

const config = {
  url: `mongodb://${DB_HOST}:${DB_PASS}@${DB_URL}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: DB_DATABASE,
  },
};

export default async () => {
  try {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.url, config.options);
  mongoose.connection.on('error', async(error) => {
    logger.error(`MongoDB error > ${error}`);
    await sleep(1000);
    process.exit(1);
  });

  logger.info(`MongoDB Connected ${config.url}`);
  } catch(error) {
    logger.error(`MongoDB Connect error > ${error.stack}`);
    await sleep(1000);
    process.exit(1);
  }
};