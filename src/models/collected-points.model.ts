import { EventModel } from './event.model';
// collectedPoints-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';
import { TeamModel } from './team.model';

export type CollectedPointsModel = {
  id: string;
  teamId: string;
  eventId: string;
  points: number;
  team: TeamModel;
  event: EventModel;
};

export default function (app: Application): Model<any> {
  const modelName = 'collectedPoints';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    teamId: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'event', required: true },
    points: { type: Number, required: true },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
