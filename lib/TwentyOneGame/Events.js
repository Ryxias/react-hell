'use strict';

const { EventTypes } = require('./EventTypes');

const gameInitializedEvent = function gameInitializedEvent() {
  return {
    type: EventTypes.game_initialized,
  };
};

const nextPlayerTurnEvent = function nextPlayerTurnEvent(next_player_id) {
  return {
    type: EventTypes.next_player_turn,
    next_player_id: next_player_id,
  };
};

const roundEndedEvent = function roundEndedEvent() {
  return {
    type: EventTypes.round_ended,
  };
};

const playerReceiveCard = function playerReceiveCard(player_id, card, hidden) {
  return {
    type: EventTypes.receive_card,
    player: player_id,
    card: card,
    hidden: hidden,
  };
};

const roundStartedEvent = function roundStartedEvent() {
  return {
    type: EventTypes.round_started,
  };
};

const roundResolutionEvent = function roundResolutionEvent(
  goal,
  winner,
  tie,
  player_totals,
  player_hands,
  player_losses
) {
  return {
    type: EventTypes.round_resolution,
    goal: goal,
    winner: winner,
    tie: tie,
    player_totals: player_totals,
    player_hands: player_hands,
    player_losses: player_losses,
  };
};

const gameResolutionEvent = function gameResolutionEvent(winner) {
  return {
    type: EventTypes.game_ended,
    winner: winner,
  };
};

module.exports = {
  gameInitializedEvent,
  roundEndedEvent,
  playerReceiveCard,
  roundResolutionEvent,
  roundStartedEvent,
  gameResolutionEvent,
  nextPlayerTurnEvent,
};
