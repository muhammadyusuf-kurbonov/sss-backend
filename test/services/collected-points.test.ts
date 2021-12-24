import { Application } from './../../src/declarations.d';
import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';

async function assignPoints(app: Application, points = 75){
  const team = await app.service('teams').create({
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

    assert.ok(collectedPoints, 'Not created a collectedPoints');
    assert.ok(collectedPoints.team, 'Not fetched a team');
    assert.ok(collectedPoints.event, 'Not fetched a event');
  });
});
