'use strict';

require('./init');
const assert = require('assert');

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
    }).catch(err => {
      assert.equal('You are not part of this game! The players are: [1,abc2] [0007JPWQJD]', value);
    });
  });

});
