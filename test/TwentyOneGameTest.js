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
    let g = new Game('test', `${Date.now()}-${Math.random()}`, output);
    return g.debugSetGameState(
      { key: '21-game-test-1506815984174-0.6034531060655397',
        player_data: {
          abc1: { player_id: 'abc1', hand: [ {card: 1, hidden: true}, {card:3, hidden: false} ] },
          xyz2: { player_id: 'xyz2', hand: [ {card: 2, hidden: true}, {card:4, hidden: false} ] },
        },
        deck: [ 5, 6, 7, 8, 9, 10, 11 ],
        game_started: true,
        game_over: false,
        player_acted: { 'xyz2': false, 'abc1': true },
        player_turn: 'xyz2' })
      .then((game) => game)
      .then(game => {
        return [game, game.getPlayer('abc1'), game.getPlayer('xyz2')];
      });
  };

  it('should support whos turn', function () {
    let value = '';
    const capture = function(message) { value = message; };

    let stored_game, player1, player2;
    return newStartedGame(capture)
      .spread((game, p1, p2) => {
        player1 = p1;
        player2 = p2;
        stored_game = game;
        return player2.whosTurn();
      })
      .then(() => {
        assert.equal('Your turn!', value);
      })
      .then(() => {
        return player1.whosTurn();
      })
      .then(() => {
        assert.equal(`Player <@xyz2>'s turn`, value);
      });
  });

  it('should support hit', function () {
    let value = '';
    const capture = function(message) { value += message + '\n'; };

    let stored_game;
    let player1, player2;
    return newStartedGame(capture)
      .spread((game, p1, p2) => {
        player1 = p1;
        player2 = p2;
        stored_game = game;
      })
      .then(() => player2.hit())
      .then(() => stored_game.debugGetGameState())
      .then(game_state => {
        assert.ok(!game_state.game_over);

        // The first card of the deck should be removed and move to player2's hand
        let deck = game_state.deck;
        assert.deepEqual([6,7,8,9,10,11], deck);

        let p2_hand = game_state.player_data["xyz2"].hand;
        assert.deepEqual([
          {card: 2, hidden: true},
          {card: 4, hidden: false},
          {card: 5, hidden: false},
        ], p2_hand);

        // Player 2 did something
        assert.ok(game_state.player_acted['xyz2']);

        // And it should now be player1's turn
        assert.equal('abc1', game_state.player_turn);
      });
  });

  it('should support stay', function () {
    let value = '';
    const capture = function(message) { value += message + '\n'; };

    let stored_game;
    let player1, player2;
    return newStartedGame(capture)
      .spread((game, p1, p2) => {
        player1 = p1;
        player2 = p2;
        stored_game = game;
      })
      .then(() => player2.stay())
      .then(() => stored_game.debugGetGameState())
      .then(game_state => {
        assert.ok(!game_state.game_over);

        // Nothing in player2's hand
        let deck = game_state.deck;
        assert.deepEqual([5,6,7,8,9,10,11], deck);

        let p2_hand = game_state.player_data["xyz2"].hand;
        assert.deepEqual([
          {card: 2, hidden: true},
          {card: 4, hidden: false},
        ], p2_hand);

        // Also mark that player2 did not do anything
        assert.ok(!game_state.player_acted['xyz2']);

        // And it should now be player1's turn
        assert.equal('abc1', game_state.player_turn);
      });
  });

  it('double pass should end game', function () {
    let value = '';
    const capture = function(message) { value += message + '\n'; };

    let stored_game;
    let player1, player2;
    return newStartedGame(capture)
      .spread((game, p1, p2) => {
        player1 = p1;
        player2 = p2;
        stored_game = game;
      })
      .then(() => player2.stay())
      .then(() => player1.stay())
      .then(() => stored_game.debugGetGameState())
      .then(game_state => {
        // Also mark that both player1 and player2 did not do anything
        assert.ok(!game_state.player_acted['abc1']);
        assert.ok(!game_state.player_acted['xyz2']);

        // It's game over now
        assert.ok(game_state.game_over);
      });
  });

});