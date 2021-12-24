import { HookContext } from '@feathersjs/feathers';

function removePoints(){
  return async (context: HookContext) => {
    const {id} = context;

    await context.app.service('collected-points').remove(null, {  
      query: {
        eventId: id?.toString(),
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
    all: [],
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
