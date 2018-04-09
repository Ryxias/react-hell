'use strict';

const DICE_ACTIONS = require('../actions/dice_actions');

function dice(state = {}, action) {
  switch (action.type) {
    case DICE_ACTIONS.DICE_ADDED: {
      const newState = Object.assign({}, state);
      const { dieSize } = action;

      newState.dice = newState.dice || [];
      newState.dice = newState.dice.concat(dieSize); // Dont use .push() because it mutates

      return newState;
    }
    case DICE_ACTIONS.DICE_CLEARED: {
      const newState = Object.assign({}, state);
      newState.dice = [];
      return newState;
    }
    case DICE_ACTIONS.DICE_ROLLED: {
      const newState = Object.assign({}, state);
      newState.rolls = action.rolls;

      // Perform deterministic statistical analysis of dice here

      return newState;
    }
    default:
      return state;
  }
}

module.exports = dice;
