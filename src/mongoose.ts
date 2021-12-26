import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';

function buildMongoUri(app: Application): string {
  if (!process.env.QOVERY_APPLICATION_Z30302B0F_NAME) return app.get('mongodb');
  const pass = encodeURIComponent(process.env.QOVERY_MONGODB_ZF874FF2F_PASSWORD ?? '');
  return `mongodb://${process.env.QOVERY_MONGODB_ZF874FF2F_LOGIN}:${pass}@${process.env.QOVERY_MONGODB_ZF874FF2F_HOST}:${process.env.QOVERY_MONGODB_ZF874FF2F_PORT}/yahoom`;
}

export default function (app: Application): void {
  console.log('Connecting to MongoDB...', buildMongoUri(app));
  mongoose.connect(
    buildMongoUri(app),
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
}
