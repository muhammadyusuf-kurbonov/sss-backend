import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';

export default function (app: Application): void {
  mongoose.connect(
    process.env.QOVERY_MONGODB_ZF874FF2F_DATABASE_URL_INTERNAL 
      ? process.env.QOVERY_MONGODB_ZF874FF2F_DATABASE_URL_INTERNAL
      : app.get('mongodb'),
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
}
