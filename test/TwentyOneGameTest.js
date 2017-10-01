'use strict';

require('./init');
const assert = require('assert');
const Game = require(PROJECT_ROOT + '/lib/TwentyOneGame/Game');

describe('21 Game Setup', function() {
  const newGame = function (output) {
    return new Game('test', `${Date.now()}-${Math.random()}`, output);
  };

  it('should support join', function () {
    let value = '';
    const capture = function(message) {
      value = message;
    };
    let game = newGame(capture);

    return game.addPlayer('abc1')
      .then(() => {
        assert.equal('Player <@abc1> joined!', value);
      })
      .then(() => {
        return game.addPlayer('xyz2');
      })
      .then(() => {
        assert.equal('Player <@xyz2> joined!', value);
      });
  });

  it('should support whoami', function () {
    let value = '';
    const capture = function(message) {
      value = message;
    };
    let game = newGame(capture);

    return game.addPlayer('abc')
      .then(() => {
        return game.getPlayer('abc')
      })
      .then(player => {
        return player.whoami();
      })
      .then(() => {
        assert.equal(`You're player abc, <@abc>!`, value);
      });
  });

  it('should error on non-players', function () {
    let value = '';
    const capture = function(message) { value = message; };
    let game = newGame(capture);

    return game.getPlayer('adslfahw')
      .then(player => {
        return player.whoami();
      })
      .then(() => { assert.fail('Whoops') })
      .catch(err => {
        assert.equal('You are not part of this game! The players are: [] [0007JPWQJD]', value);
      });
  });

  it('should support get players', function () {
    let value = '';
    const capture = function(message) { value = message; };
    let game = newGame(capture);

    // First add 1 player
    game.addPlayer('abc1')
      .then(player1 => {
        return [player1, player1.whosPlaying()];
      })
      // Should be 1 player
      .spread((player1, none) => {
        assert.equal('Players are: [<@abc1>]', value);
        return player1;
      })
      // Add a second player
      .then(player1 => {
        return [player1, game.addPlayer('xyz2')];
      })
      // Second player's whosPlaying() should see both players
      .spread((player1, player2) => {
        return [player1, player2, player2.whosPlaying()];
      })
      .then(args => {
        assert.equal('Players are: [<@abc1>,<@xyz2>]', value);
        return args;
      })
      // And first player's whosPlaying() should now also see both players
      .spread((player1, player2, none) => {
        return [player1, player2, player1.whosPlaying()];
      })
      .then(() => {
        assert.equal('Players are: [<@abc1>,<@xyz2>]', value);
      })
      .catch(err => {
        assert.fail('What the fuck: ' + err.message);
      });
  });

  it('should support start game', function () {
    let value = '';
    const capture = function(message) { value = message; };
    let game = newGame(capture);

    return game.addPlayer('abc1')
      .then(player1 => {
        return [player1, game.addPlayer('xyz2')];
      })
      .spread((player1, player2) => {
        return [player1, player2, player1.startGame()];
      })
      .spread((player1, player2, none) => {
        assert.equal('The game has begun!', value);
        return game.debugGetGameState();
      })
      .then(game_state => {
        assert(game_state.game_started);
      });
  });

  it('should support start game', function () {
    let value = '';
    const capture = function(message) { value = message; };
    let game = newGame(capture);

    return game.addPlayer('abc1')
      .then(player1 => {
        return [player1, game.addPlayer('xyz2')];
      })
      .spread((player1, player2) => {
        return [player1, player2, player1.startGame()];
      })
      .spread((player1, player2, none) => {
        assert.equal('The game has begun!', value);
        return game.debugGetGameState();
      })
      .then(game_state => {
        assert(game_state.game_started);
      });
  });
});


describe('21 Game Setup', function () {
  const newStartedGame = function(output) {
    let game = new Game('test', `${Date.now()}-${Math.random()}`, output);
    return game.debugSetGameState(
      { key: '21-game-test-1506815984174-0.6034531060655397',
        player_data: { abc1: { player_id: 'abc1' }, xyz2: { player_id: 'xyz2' } },
        deck: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
        game_started: true,
        player_turn: 'xyz2' })
      .then(() => game);
  };

  it('should support whos turn', function () {
    let value = '';
    const capture = function(message) { value = message; };

    return newStartedGame(capture)
      .then(game => {
        return [game, game.getPlayer('xyz2')];
      })
      .spread((game, player_xyz2) => {
        return [game, player_xyz2.whosTurn()];
      })
      .spread((game, none) => {
        assert.equal('Your turn!', value);
        return game;
      })
      .then(game => {
        return [game, game.getPlayer('abc1')];
      })
      .spread((game, player_abc1) => {
        return [game, player_abc1.whosTurn()];
      })
      .spread((game, none) => {
        assert.equal(`Player <@xyz2>'s turn`, value);
      });
  });

  it('should support hit', function () {
    let value = '';
    const capture = function(message) { value += message + '\n'; };

    let player1, player2;
    return newStartedGame(capture)
      .then(game => {
        return [game, game.getPlayer('abc1'), game.getPlayer('xyz2')];
      })
      .spread((game, p1, p2) => {
        player1 = p1;
        player2 = p2;
      })
      .then(() => player2.hit())
      .then(() => {
        return game.getEngine()
      })
      .then(engine => {
        engine.getPlayerah
      });
  });

});
