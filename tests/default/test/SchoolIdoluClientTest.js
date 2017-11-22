'use strict';

const assert = require('assert');

describe('SchoolIdo.lu Client', function() {
  const LoveLiveClient = require('../../../lib/SchoolIdo.lu/Client');
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
