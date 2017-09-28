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

describe('21 Game', function() {
  const Game = require(PROJECT_ROOT + '/lib/TwentyOneGame/Game');

  it('should be able to join the game', function() {
    let value = '';
    const capture = function(message) {
      value = message;
    };
    let game = new Game('test', 1, capture);

    return game.addPlayer(1)
      .then(() => {
        assert.equal('Player 1 joined!', value);
      })
      .then(() => {
        return game.addPlayer('abc2');
      })
      .then(() => {
        assert.equal('Player abc2 joined!', value);
      });
  });

  it('should be able to get the players', function() {
    let value = '';
    const capture = function(message) {
      value = message;
    };
    let game = new Game('test', 1, capture);

    return game.getPlayer(1).then(player => {
      return player.whoami();
    }).then(() => {
      assert.equal(`You're player 1!`, value);
    });
  });

  it('should be error on non-players', function() {
    let value = '';
    const capture = function(message) {
      value = message;
    };
    let game = new Game('test', 1, capture);

    return game.getPlayer('adslfahw').then(player => {
      return player.whoami();
    }).then(() => {
      assert.equal('adf??', value);
    });
  });

});
