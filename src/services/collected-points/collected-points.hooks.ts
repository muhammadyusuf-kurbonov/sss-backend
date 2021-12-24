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
    create: [],
    update: [],
    patch: [],
    remove: []
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
