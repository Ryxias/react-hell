'use strict';

const { EventTypes } = require('./EventTypes');

const gameInitializedEvent = function gameInitializedEvent() {
  return {
    type: EventTypes.game_initialized,
  };
};

const gameEndedEvent = function gameEndedEvent() {
  return {
    type: EventTypes.game_ended,
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

const roundResolutionEvent = function gameResolutionEvent(
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

module.exports = {
  gameInitializedEvent,
  gameEndedEvent,
  playerReceiveCard,
  roundResolutionEvent,
};
