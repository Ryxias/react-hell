'use strict';

const { ActionTypes } = require('./EventTypes');

const playerJoinAction = function playerJoinAction(player_id) {
  return {
    type: ActionTypes.player_join,
    player_id: player_id,
  }
};

const playerLeaveAction = function playerLeaveAction(player_id) {
  return {
    type: ActionTypes.player_leave,
    player_id: player_id,
  };
};

const playerHitAction = function playerHitAction(player_id) {
  return {
    type: ActionTypes.player_hit,
    player_id: player_id,
  };
};

const playerStayAction = function playerStayAction(player_id) {
  return {
    type: ActionTypes.player_stay,
    player_id: player_id,
  };
};

const gameStartAction = function gameStartAction() {
  return {
    type: ActionTypes.start_game,
  }
};


module.exports = {
  playerJoinAction,
  gameStartAction,
  playerLeaveAction,
  playerStayAction,
  playerHitAction,
};
