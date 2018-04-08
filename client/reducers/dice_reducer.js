'use strict';

const DICE_ACTIONS = require('../actions/dice_actions');

function dice(state = {}, action) {
  switch (action.type) {
    case DICE_ACTIONS.ADD_DICE: {
      const newState = Object.assign({}, state);
      const { dieSize } = action;

      newState.dice = newState.dice || {};
      newState.dice[dieSize] = newState.dice[dieSize] || 0;
      newState.dice[dieSize] += 1;

      return newState;
    }
    case DICE_ACTIONS.DO_DICE_ROLL: {
      const newState = Object.assign({}, state);

      newState.currentRoll = {};



      return newState;
    }
    default:
      return state;
  }
}

module.exports = dice;
