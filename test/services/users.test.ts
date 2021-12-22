import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';
import { UserModel } from '../../src/models/users.model';
import { sleep } from '../utils';
import { Paginated } from '@feathersjs/feathers';

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  it('creates a user', async () => {
    const user = await app.service('users').create({
      fullName: 'John Doe',
      email: 'test@yahoom.com',
      teamId: 'team-1',
    });

    assert.ok(user, 'Created a user');
    assert.ok(user._id, 'User has an id');
    assert.notStrictEqual(user.teamId.toString(), 'team-1', 'User teamId is not the same as team name');
    assert.notStrictEqual(user.avatarUrl, '', 'User avatarUrl is not empty');
  });

  it('finds a user', async () => {
    await app.service('users').create({
      fullName: 'John Doe',
      email: 'test@yahoom.com',
      teamId: 'team-1',
    });

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
});
