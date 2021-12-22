import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';

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

  
});
