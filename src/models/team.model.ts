// team-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';
import { UserModel } from './users.model';

export type TeamModel = {
  _id: string;
  name: string;
  score: number;
  members: UserModel[];
}

export default function (app: Application): Model<TeamModel> {
  const modelName = 'team';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true, default: 0 },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<TeamModel>(modelName, schema);
}
