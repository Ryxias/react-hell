'use strict';

require('./init');
const assert = require('assert');
const GameState = require(PROJECT_ROOT + '/lib/TwentyOneGame/GameState');
const Actions = require(PROJECT_ROOT + '/lib/TwentyOneGame/Actions');
const { ActionTypes, EventTypes } = require(PROJECT_ROOT + '/lib/TwentyOneGame/EventTypes');

describe('GameState', function() {

  it('should support set key', function() {
    const game_state = new GameState();
    game_state.setKey('abc123');

    assert.equal(game_state.key, 'abc123');
  });

  it('should support player join action', function() {
    const action = Actions.playerJoinAction('eromanga_sensei');
    const game_state = new GameState();

    const events = game_state.dispatch(action);

    assert.deepEqual(game_state.getPlayerIds(), ['eromanga_sensei']);
    assert.ok(game_state.playerExists('eromanga_sensei'));
    assert.ok(!game_state.playerExists('yamada_elf'));
    assert.deepEqual(
      game_state.player_data,
      {
        eromanga_sensei: {
          player_id: 'eromanga_sensei',
        }
      }
    );

    assert.equal(events.length, 1);
    assert.equal(ActionTypes.player_join, events[0].type);
  });

  it('should support player leave action', function() {
    const action = Actions.playerLeaveAction('eromanga_sensei');
    const game_state = new GameState();
    game_state.player_data = {eromanga_sensei: {player_id: 'eromanga_sensei'}};
    assert.ok(game_state.playerExists('eromanga_sensei'));

    const events = game_state.dispatch(action);

    assert.deepEqual(game_state.player_data, {});
    assert.ok(!game_state.playerExists('eromanga_sensei'));

    assert.equal(events.length, 1);
    assert.equal(ActionTypes.player_leave, events[0].type);
  });


  it('should support game initialization action', function() {
    const action = Actions.gameStartAction();
    const game_state = new GameState();
    game_state.player_data = {
      eromanga_sensei: {player_id: 'eromanga_sensei'},
      yamada_elf: {player_id: 'yamada_elf'},
    };

    const events = game_state.dispatch(action);

    assert.equal(events.length, 6);
    assert.equal(ActionTypes.start_game, events[0].type);
    assert.equal(EventTypes.receive_card, events[1].type);
    assert.equal(EventTypes.receive_card, events[2].type);
    assert.equal(EventTypes.receive_card, events[3].type);
    assert.equal(EventTypes.receive_card, events[4].type);
    assert.equal(EventTypes.game_initialized, events[5].type);

    assert.ok(game_state.game_started);
    assert.ok(!game_state.game_over);
    assert.ok(!!game_state.player_turn);

    assert.equal(game_state.deck.length, 7); // 11 cards - 4 cards dealt

    assert.equal(game_state.player_data.eromanga_sensei.hand.length, 2);
    assert.ok(game_state.player_data.eromanga_sensei.hand[0].hidden);
    assert.ok(!game_state.player_data.eromanga_sensei.hand[1].hidden);

    assert.equal(game_state.player_data.yamada_elf.hand.length, 2);
    assert.ok(game_state.player_data.yamada_elf.hand[0].hidden);
    assert.ok(!game_state.player_data.yamada_elf.hand[1].hidden);
  });

});
