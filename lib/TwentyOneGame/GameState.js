'use strict';

const reducerStack = require('./reducers');

/**
 * A stateful, synchronous, dependency-less container for all of the game's state.
 * Persistence does not belong here.
 *
 * This gamestate should not be modified directly; instead, it provides a suite of
 * all possible state transitions.
 */
class GameState {
  /**
   *
   */
  constructor() {
    // A unique identifier for this gamestate.  Every unique game has a different key.
    this.key = null;

    // A map of player_id => individual player state.
    //
    //   The player's state has:
    //     -
    this.player_data = {};

    // The deck, ordered from topmost to bottom most
    this.deck = [];

    // True when the game is in session, false otherwise
    this.game_started = false;

    // True when an in-session game is over.
    this.game_over = false;

    // Maps player_ids to their most recent action(s)
    this.player_acted = {};

    // The player_id whose turn it is
    this.player_turn = null;

    // A historic log of everything that happened during the game
    this.events = [];
  }

  setKey(key) {
    this.key = key;
  }

  isGameStarted() {
    return this.game_started;
  }

  getPlayerIds() {
    return Object.keys(this.player_data);
  }

  playerExists(player_id) {
    return !!this.player_data[player_id];
  }

  getDeck() {
    return this.deck;
  }

  isGameOver() {
    return this.game_over;
  }

  allPlayersStayed() {
    let stayed = true;
    this.getPlayerIds().forEach(player_id => {
      if (this.player_acted[player_id]) {
        stayed = false;
      }
    });
    return stayed;
  }

  getPlayerHand(player_id) {
    return this.player_data[player_id].hand;
  }

  isPlayerTurn(player_id) {
    return player_id === this.player_turn;
  }

  whosTurn() {
    return this.player_turn;
  }

  unserialize(serialized_state) {
    let data = JSON.parse(serialized_state);

    this.key = data.key || '';
    this.player_data = data.player_data || {};
    this.deck = data.deck || [];
    this.game_started = data.game_started || false;
    this.game_over = data.game_over || false;
    this.player_acted = data.player_acted || {};
    this.player_turn = data.player_turn || null;
    this.events = data.events || [];
  }

  serialize() {
    return JSON.stringify(
      {
        key: this.key,
        player_data: this.player_data,
        deck: this.deck,
        game_started: this.game_started,
        game_over: this.game_over,
        player_acted: this.player_acted,
        player_turn: this.player_turn,
        events: this.events,
      }
    );
  }

  /**
   * Fires an action, modifying the game state appropriately via the
   * configured reducers.
   *
   * Actions always result in new events being recorded in the game state event
   * log.  The return value of the dispatch call are all NEW events generated
   * by this action.
   */
  dispatch(action) {
    // FIXME hack in the design
    let last_event_index = this.events.length;
    reducerStack.forEach(reducer => {
      reducer(this, action);
    });
    // Now we slice off all the events after the reducers are applied to find the new ones
    return this.events.slice(last_event_index);
  }

  triggerEvent(event) {
    this.events.push(event);
  }
}


module.exports = GameState;
