import { UserModel } from './../../models/users.model';
import { HookContext } from '@feathersjs/feathers';
import { CastError, Schema } from 'mongoose';
import {fastJoin} from 'feathers-hooks-common';
function validateTeamId(){
  return async (context: HookContext) => {
    const { data } = context;
    const { teamId } = data;
    if (!teamId) {
      throw new Error('Team not found');
    }
    return context;
  };
}

function generateAvatar(){
  return async (context: HookContext) => {
    const { data } = context;
    const { fullName, avatarUrl } = data;
    if (avatarUrl) return context;
    const avatar = `https://ui-avatars.com/api/?name=${fullName.split(' ').join('+')}&background=random&size=128&bold=true&color=random`;
    context.data.avatarUrl = avatar;
    return context;
  };
}

function createTeamIfNotExists(){
  return async (context: HookContext) => {
    const { data } = context;
    const { teamId } = data;
    
    if (!teamId) return context;

    try{
      const team = await context.app.service('teams').get(teamId, context.params);
      if (!team) {
        const {_id} = await context.app.service('teams').create({
          name: teamId,
        });
        context.data.teamId = _id.toString();
      }
    } catch(err) {
      const {_id} = await context.app.service('teams').create({
        name: teamId,
      });
      context.data.teamId = _id.toString();
    }
    return context;
  };
}

function populateTeam(){
  const postResolvers = {
    joins: {
      team: () => async (item: UserModel, context: HookContext) => {
        item.team = await context.app.service('teams')._get(item.teamId);
        return item;
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
    create: [createTeamIfNotExists(), validateTeamId(), generateAvatar()],
    update: [],
    patch: [createTeamIfNotExists()],
    remove: []
  },

  after: {
    all: [populateTeam()],
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
