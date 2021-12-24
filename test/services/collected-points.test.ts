import { TeamModel } from './../../src/models/team.model';
import { Application } from './../../src/declarations.d';
import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';

async function assignPoints(app: Application, teamArg?: TeamModel, points = 75){
  const team: TeamModel = teamArg ? teamArg : await app.service('teams').create({
    name: 'test-team',
  });

  const event = await app.service('event').create({
    title: 'test-event',
    description: 'Test event for testing',
    maxScore: 100
  });

  const collectedPoints = await app.service('collected-points').create({
    teamId: team._id,
    eventId: event._id,
    points: points
  });

  return {
    team,
    event,
    collectedPoints
  };
}

describe('\'collectedPoints\' service', () => {
  it('registered the service', () => {
    const service = app.service('collected-points');

    assert.ok(service, 'Registered the service');
  });

  it('asing points', async ()=>{
    const {collectedPoints} = await assignPoints(app);

    const team = await app.service('teams').get(collectedPoints.teamId);

    assert.ok(collectedPoints, 'Not created a collectedPoints');
    assert.ok(collectedPoints.team, 'Not fetched a team');
    assert.ok(collectedPoints.event, 'Not fetched a event');
    assert.strictEqual(collectedPoints.points, 75, 'CollectedPoints points is incorrect');
    assert.strictEqual(team.score, 75, 'Team points is incorrect');
  });

  it('get points', async ()=>{
    const {collectedPoints} = await assignPoints(app);

    const points = await app.service('collected-points').get(collectedPoints._id);

    assert.ok(points, 'Not found a collectedPoints');
    assert.ok(points.team, 'Not fetched a team');
    assert.ok(points.event, 'Not fetched a event');
  });

  it('update points', async ()=>{
    const {collectedPoints} = await assignPoints(app);

    const points = await app.service('collected-points').patch(collectedPoints._id, {
      points: 100
    });

    const team = await app.service('teams').get(collectedPoints.teamId);

    assert.ok(points, 'Not updated a collectedPoints');
    assert.ok(points.team, 'Not fetched a team');
    assert.ok(points.event, 'Not fetched a event');
    assert.strictEqual(points.points, 100, 'Points is incorrect');
    assert.strictEqual(team.score, 100, 'Team points is incorrect');
  });

  it('delete points', async ()=>{
    const {collectedPoints} = await assignPoints(app);

    const points = await app.service('collected-points').remove(collectedPoints._id);

    const team = await app.service('teams').get(collectedPoints.teamId);

    assert.ok(points, 'Not deleted a collectedPoints');
    assert.ok(points.team, 'Not fetched a team');
    assert.ok(points.event, 'Not fetched a event');
    assert.strictEqual(points.points, 75, 'Points is incorrect');
    assert.strictEqual(team.score, 0, 'Team points is incorrect');
  });

  it('sum points for team score', async ()=> {
    let {team} = await assignPoints(app);
    await assignPoints(app, team, 50);
    
    team = await app.service('teams').get(team._id);

    assert.strictEqual(team.score, 125, 'Team points is incorrect');
  });

  it('reduce team score when deleting collected points', async() => {
    const oldData = await assignPoints(app);
    await assignPoints(app, oldData.team, 50);
    await app.service('collected-points').remove(oldData.collectedPoints._id);

    const team = await app.service('teams').get(oldData.team._id);

    assert.strictEqual(team.score, 50, 'Team points is incorrect');
  });

  it('reduce team score when updating collected points', async() => {
    const oldData = await assignPoints(app);
    await assignPoints(app, oldData.team, 50);
    await app.service('collected-points').patch(oldData.collectedPoints._id, {
      points: 100
    });

    const team = await app.service('teams').get(oldData.team._id);

    assert.strictEqual(team.score, 150, 'Team points is incorrect');
  });
});
