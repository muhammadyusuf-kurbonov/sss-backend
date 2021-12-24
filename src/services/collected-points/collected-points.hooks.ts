import { CollectedPointsModel } from './../../models/collected-points.model';
import { HookContext } from '@feathersjs/feathers';
import { fastJoin } from 'feathers-hooks-common';

function populateJoins(){
  const postResolvers = {
    joins: {
      team: () => async (item: CollectedPointsModel, context: HookContext) => {
        item.team = await context.app.service('teams').get(item.teamId);
      },
      event: () => async (item: CollectedPointsModel, context: HookContext) => {
        item.event = await context.app.service('event').get(item.eventId);
      }
    }
  };
  return fastJoin(postResolvers);
}

function updateTeamsScore() {
  return async (context: HookContext) => {
    const {data, result} = context;
    if (data.points == undefined) return context;
    const {teamId} = data && result;

    const pointsModel = (await context.app.service('collected-points').Model.aggregate([
      { $match: { teamId } },
      { $group: { _id: null, points: { $sum: '$points' } } }
    ]))[0];

    const points = pointsModel ? pointsModel.points : 0;

    await context.app.service('teams').patch(teamId, {  
      score: points
    });
  };
}

function descreaseTeamsScore(){
  return async (context: HookContext) => {
    const {result} = context;
    if (result.points == undefined) return context;
    const {teamId} = result;

    await context.app.service('teams').patch(teamId, {  
      $inc: { score: -result.points }
    });
  };
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateJoins()],
    find: [],
    get: [],
    create: [updateTeamsScore()],
    update: [],
    patch: [updateTeamsScore()],
    remove: [descreaseTeamsScore()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
