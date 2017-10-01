'use strict';

require('./init');
const assert = require('assert');

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
