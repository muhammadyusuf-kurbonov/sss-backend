import assert from 'assert';
import app from '../../src/app';
import {describe} from 'mocha';

describe('\'event\' service', () => {
  it('registered the service', () => {
    const service = app.service('event');

    assert.ok(service, 'Registered the service');
  });

  it('create event', async ()=>{
    const event = await app.service('event').create({
      title: 'test-event',
      description: 'Test event for testing',
      maxScore: 100
    });

    assert.ok(event, 'Not created a event');
    assert.ok(event._id, 'Event has not an id');
    assert.strictEqual(event.title, 'test-event', 'Event title is incorrect');
    assert.strictEqual(event.description, 'Test event for testing', 'Event description is incorrect');
    assert.strictEqual(event.maxScore, 100, 'Event maxScore is incorrect');
  });

  it('get event', async ()=>{
    const {_id} = await app.service('event').create({
      title: 'test-event',
      description: 'Test event for testing',
      maxScore: 100
    });

    const event = await app.service('event').get(_id);
    assert.ok(event, 'Not found a event');
    assert.ok(event._id, 'Event has not an id');
    assert.strictEqual(event.title, 'test-event', 'Event title is incorrect');
    assert.strictEqual(event.description, 'Test event for testing', 'Event description is incorrect');
    assert.strictEqual(event.maxScore, 100, 'Event maxScore is incorrect');
  });

  it('update event', async ()=>{
    const {_id} = await app.service('event').create({
      title: 'test-event',
      description: 'Test event for testing',
      maxScore: 100
    });

    const event = await app.service('event').patch(_id, {
      title: 'test-event-updated',
      description: 'Test event for testing updated',
      maxScore: 200
    });

    assert.ok(event, 'Not updated a event');
    assert.ok(event._id, 'Event has not an id');
    assert.strictEqual(event.title, 'test-event-updated', 'Event title is incorrect');
    assert.strictEqual(event.description, 'Test event for testing updated', 'Event description is incorrect');
    assert.strictEqual(event.maxScore, 200, 'Event maxScore is incorrect');
  });

  it('delete event', async ()=>{
    const {_id} = await app.service('event').create({
      title: 'test-event',
      description: 'Test event for testing',
      maxScore: 100
    });

    const removed = await app.service('event').remove(_id);
    const pointsForEvent = await app.service('collected-points')._find({
      query: {
        eventId: _id,
      },
      paginate: false,
    });

    assert.ok(removed, 'Not removed a event');
    assert.ok(removed._id, 'Event has not an id');
    assert.strictEqual(removed.title, 'test-event', 'Event title is incorrect');
    assert.strictEqual(removed.description, 'Test event for testing', 'Event description is incorrect');
    assert.strictEqual(removed.maxScore, 100, 'Event maxScore is incorrect');
    assert.strictEqual(pointsForEvent.length, 0, 'There left points of event');
  });
});
