'use strict';

/**
 * Actions are the only things that should be fired to the dispatch() call of the
 * GameState.  They are ALSO recorded by the GameState in the events.
 */
const ActionTypes = {
  player_join: 'player_join',
  player_leave: 'player_leave',
  player_hit: 'player_hit',
  player_stay: 'player_stay',
  start_game: 'start_game',
};

/**
 * Events should not be dispatched by user code; instead, they are fired by the
 * reducers and are designed for some form of future enhancement (event listeners?)
 * to react to.  Events are also recorded by the GameState.
 */
const EventTypes = {
  game_started: 'game_started',
  receive_card: 'receive_card',
  game_initialized: 'game_initialized',
  game_ended: 'game_ended',
  round_resolution: 'round_resolution',
};

module.exports = {
  ActionTypes,
  EventTypes,
};
