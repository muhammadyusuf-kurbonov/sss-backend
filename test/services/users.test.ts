import { Application } from './../../src/declarations.d';
import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';
import { UserModel } from '../../src/models/users.model';
import { sleep } from '../utils';
import { Paginated } from '@feathersjs/feathers';

async function createUser(app: Application){
  const user = await app.service('users').create({
    fullName: 'John Doe',
    email: 'test@yahoom.com',
    teamId: 'team-1',
  }).catch(err => console.log(err));
  return user;
}

describe('\'users\' service', function() {
  this.timeout(10000);
  
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  it('creates a user', async () => {
    const user = await createUser(app);
    assert.ok(user, 'Created a user');
    assert.ok(user._id, 'User has an id');
    assert.notStrictEqual(user.teamId.toString(), 'team-1', 'User teamId is not the same as team name');
    assert.notStrictEqual(user.avatarUrl, '', 'User avatarUrl is not empty');
  });

  it('finds a user', async () => {
    await createUser(app);

    const foundUser = await app.service('users').find({
      query: {
        email: 'test@yahoom.com',
      },
    }).then((value: any) => value.data) as UserModel[];

    assert.ok(foundUser, 'Found a user');
    assert.ok(foundUser[0]._id, 'User has an id');
    assert.strictEqual(foundUser[0].email, 'test@yahoom.com');
    assert.ok(foundUser[0].avatarUrl, 'User avatarUrl is not empty');
    assert.ok(foundUser[0].team, 'User team is not empty');
    assert.strictEqual(foundUser[0].team.name, 'team-1');
  });

  it('finds a user by id', async () => {
    const user = await createUser(app);

    await sleep(1000);

    const foundUser = await app.service('users').get(user._id);

    assert.ok(foundUser, 'Found a user');
    assert.ok(foundUser._id, 'User has an id');
    assert.strictEqual(foundUser.email, 'test@yahoom.com');
    assert.ok(foundUser.avatarUrl, 'User avatarUrl is not empty');
    assert.ok(foundUser.team, 'User team is not empty');
    assert.ok(foundUser.teamId, 'User team id is not empty');
    assert.strictEqual(foundUser.team.name, 'team-1');
  });

  it('updates a user', async () => {
    const user = await createUser(app);

    const updatedUser = await app.service('users').patch(user._id, {
      fullName: 'Marie Jane',
    });

    assert.ok(updatedUser, 'Updated a user');
    assert.ok(updatedUser._id, 'User has an id');
    assert.strictEqual(updatedUser.fullName, 'Marie Jane');
    assert.strictEqual(updatedUser._id.toString(), user._id.toString());
  });


  it('update a user: change team', async () => {
    const user = await createUser(app);

    const updatedUser = await app.service('users').patch(user._id, {
      teamId: 'team-2',
    });

    assert.ok(updatedUser, 'Updated a user');
    assert.ok(updatedUser._id, 'User has an id');
    assert.notStrictEqual(updatedUser.teamId.toString(), 'team-2');
    assert.notStrictEqual(updatedUser.team.name, 'team-1');
    assert.strictEqual(updatedUser.team.name, 'team-2');
    assert.strictEqual(updatedUser._id.toString(), user._id.toString());
  });

  it('removes a user', async () => {
    const user = await createUser(app);

    const removedUser = await app.service('users').remove(user._id);

    assert.ok(removedUser, 'Removed a user');
    assert.ok(removedUser._id, 'User has an id');
  });
});
