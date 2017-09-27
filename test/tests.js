'use strict';

const MochaApplication = require('../init/MochaApplication');
const app = new MochaApplication();
app.boot();

const assert = require('assert');

describe('Base Case', function() {

  it('should be able to run mocha', function() {
    return assert(true);
  });

});

describe('Love Live Client', function() {
  const LoveLiveClient = require(PROJECT_ROOT + '/lib/LoveLiveClient');
  const client = new LoveLiveClient();

  it('should be able to getCard', function() {
    return client.getCard(1220).then(card => {
      // UR yousoro~
      assert.equal(1220, card.getId());
      assert.equal('UR', card.getRarity());
      assert.equal('Watanabe You', card.getName());
      assert.equal('Time Travel', card.getCollection());
      assert.equal('Aqours', card.getMainUnit());
    });
  });
});
