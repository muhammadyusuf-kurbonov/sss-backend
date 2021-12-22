// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';
import { TeamModel } from './team.model';

export type UserModel = {
  _id: Schema.Types.ObjectId;
  fullName: string;
  email: string;
  avatarUrl: string;
  teamId: string|Schema.Types.ObjectId;
  team: TeamModel;
};

export default function (app: Application): Model<UserModel> {
  const modelName = 'users';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<UserModel>(modelName, schema);
}
