import assert from 'assert';
import app from '../../src/app';

describe('\'collectedPoints\' service', () => {
  it('registered the service', () => {
    const service = app.service('collected-points');

    assert.ok(service, 'Registered the service');
  });
});
