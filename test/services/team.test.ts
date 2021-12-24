import { Application } from './../../src/declarations.d';
import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';

async function createTeam(app: Application){
  let team = await app.service('teams').create({
    name: 'test-team',
  });
  await app.service('users').create({
    fullName: 'test-user',
    email: 'test@yahoom.com',
    teamId: team._id.toString(),
  });
  team = await app.service('teams').get(team._id);
  return team;
}

describe('\'team\' service', function() {
  this.timeout(10000);

  it('registered the service', () => {
    const service = app.service('teams');

    assert.ok(service, 'Registered the service');
  });

  it('should create a team', async () => {
    const team = await createTeam(app);
  
    assert.ok(team, 'Created a team');
    assert.ok(team._id, 'Team has an id');
    assert.ok(team.members.length, 'Team has not members');
    assert.strictEqual(team.name, 'test-team', 'Team name is correct');
  });

  it('should get a team', async () => {
    const team = await createTeam(app);

    const foundTeam = await app.service('teams').get(team._id);

    assert.ok(foundTeam, 'Found the team');
    assert.ok(foundTeam.members.length, 'Team has not members');
    assert.strictEqual(foundTeam.name, 'test-team', 'Team name is incorrect');
  });

  it('should update a team', async () => {
    const team = await createTeam(app);
    const updatedTeam = await app.service('teams').update(team._id, {
      name: 'Updated Team',
    });

    assert.ok(updatedTeam, 'Updated the team');
    assert.ok(updatedTeam.members.length, 'Team has not members');
    assert.strictEqual(updatedTeam.members.length, team.members.length, 'Team has changed members');
    assert.strictEqual(updatedTeam.name, 'Updated Team', 'Team name is incorrect');
  });

  it('should remove a team', async () => {
    const team = await createTeam(app);

    const removedTeam = await app.service('teams').remove(team._id);

    assert.ok(removedTeam, 'Returned removed team');
    assert.strictEqual(removedTeam._id.toString(), team._id.toString(), 'Removed the incorrect team');
  });
});
