import { HookContext } from '@feathersjs/feathers';
import { fastJoin } from 'feathers-hooks-common';
import { TeamModel } from '../../models/team.model';

function populateMembers(){
  const postResolvers = {
    joins: {
      members: () => async (team: TeamModel, context: HookContext) => {
        const params = {
          query: {
            teamId: team._id.toString(),
          },
          paginate: false,
        };
        const users = await context.app.service('users')._find(params);
        team.members = users;
        return team;
      },
    }
  };
  return fastJoin(postResolvers);
}

function removePoints(){
  return async (context: HookContext) => {
    const {id} = context;

    await context.app.service('collected-points').remove(null, {  
      query: {
        teamId: id?.toString(),
      },
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
    remove: [removePoints()]
  },

  after: {
    all: [populateMembers()],
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
