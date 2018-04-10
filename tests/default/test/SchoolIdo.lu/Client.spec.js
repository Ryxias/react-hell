'use strict';

const assert = require('assert');
const Client = require('../../../../lib/SchoolIdo.lu/Client');

describe('SchoolIdo.lu Client', function() {
  const client = new Client();

  it('should be able to getCard', function() {
    // this makes an API call
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
