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

    assert.equal(events.length, 7);
    assert.equal(ActionTypes.start_game, events[0].type);
    assert.equal(EventTypes.receive_card, events[1].type);
    assert.equal(EventTypes.receive_card, events[2].type);
    assert.equal(EventTypes.receive_card, events[3].type);
    assert.equal(EventTypes.receive_card, events[4].type);
    assert.equal(EventTypes.game_initialized, events[5].type);
    assert.equal(EventTypes.round_started, events[6].type);

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

    assert.equal(game_state.player_data.yamada_elf.remaining_hp, 10);
    assert.equal(game_state.player_data.eromanga_sensei.remaining_hp, 10);

    assert.equal(game_state.player_data.yamada_elf.base_bet, 1);
    assert.equal(game_state.player_data.eromanga_sensei.base_bet, 1);

    assert.equal(game_state.player_data.yamada_elf.bet, 1);
    assert.equal(game_state.player_data.eromanga_sensei.bet, 1);
  });

  it('should support player hit action', function() {
    const action = Actions.playerHitAction('eromanga_sensei');
    const game_state = inProgressGameTemplate();
    const events = game_state.dispatch(action);

    assert.equal(events.length, 2);
    assert.equal(events[0].type, ActionTypes.player_hit);
    assert.equal(events[1].type, EventTypes.receive_card);
    assert.equal(events[1].player, 'eromanga_sensei');
    assert.equal(events[1].card, 1);
    assert.ok(!events[1].hidden);

    assert.equal(game_state.deck.length, 6);

    assert.ok(game_state.player_acted.eromanga_sensei);
    assert.ok(!game_state.player_acted.yamada_elf); // assume no action until they act

    assert.equal(game_state.player_turn, 'yamada_elf');

    assert.equal(game_state.player_data.eromanga_sensei.hand.length, 3);
    assert.equal(game_state.player_data.eromanga_sensei.hand[2].card, 1);

    assert.equal(game_state.player_data.yamada_elf.hand.length, 2);
  });

  it('should support player stay action', function() {
    const action = Actions.playerStayAction('eromanga_sensei');
    const game_state = inProgressGameTemplate();
    const events = game_state.dispatch(action);

    assert.equal(events.length, 1);
    assert.equal(events[0].type, ActionTypes.player_stay);

    assert.equal(game_state.deck.length, 7);

    assert.ok(!game_state.player_acted.eromanga_sensei); // did nothing!
    assert.ok(!game_state.player_acted.yamada_elf); // assume no action until they act

    assert.equal(game_state.player_turn, 'yamada_elf');

    assert.equal(game_state.player_data.eromanga_sensei.hand.length, 2);
    assert.equal(game_state.player_data.yamada_elf.hand.length, 2);
  });

  it('should support both stay end game', function() {
    const action1 = Actions.playerStayAction('eromanga_sensei');
    const action2 = Actions.playerStayAction('yamada_elf');
    const game_state = inProgressGameTemplate();
    const events1 = game_state.dispatch(action1);
    const events2 = game_state.dispatch(action2);

    assert.equal(events1.length, 1);
    assert.equal(events2.length, 3);

    assert.equal(events2[0].type, ActionTypes.player_stay);
    assert.equal(events2[1].type, EventTypes.game_ended);
    assert.equal(events2[2].type, EventTypes.round_resolution);
    assert.equal(events2[2].goal, 21);
    assert.equal(events2[2].winner, 'yamada_elf');
    assert.ok(!events2[2].tie);

    assert.equal(events2[2].player_totals.eromanga_sensei, 17);
    assert.equal(events2[2].player_totals.yamada_elf, 21);
    assert.ok(!!events2[2].player_hands);
    assert.deepEqual(events2[2].player_losses, {eromanga_sensei: 1});

    assert.equal(events2[1].type, EventTypes.game_ended);

    assert.ok(game_state.game_over);

    assert.equal(game_state.player_data.yamada_elf.remaining_hp, 10);
    assert.equal(game_state.player_data.eromanga_sensei.remaining_hp, 9);
  });
});

function inProgressGameTemplate() {
  const game_state = new GameState();
  game_state.player_data = {
    eromanga_sensei: {
      player_id: 'eromanga_sensei',
      hand: [
        { card: 8, hidden: true },
        { card: 9, hidden: false },
      ],
      remaining_hp: 10,
      base_bet: 1,
      bet: 1,
    },
    yamada_elf: {
      player_id: 'yamada_elf',
      hand: [
        { card: 10, hidden: true },
        { card: 11, hidden: false },
      ],
      remaining_hp: 10,
      base_bet: 1,
      bet: 1,
    },
  };
  game_state.player_turn = 'eromanga_sensei';
  game_state.player_acted = { eromanga_sensei: false, yamada_elf: true };
  game_state.game_started = true;
  game_state.deck = [1, 2, 3, 4, 5, 6, 7];

  return game_state;
}
