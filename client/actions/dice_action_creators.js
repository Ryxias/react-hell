'use strict';

const ACTIONS = require('./dice_actions');

function addDice(die_size) {
  return {
    type: ACTIONS.DICE_ADDED,
    dieSize: die_size,
  };
}

function clearDice() {
  return {
    type: ACTIONS.DICE_CLEARED,
  }
}

function rollDice(dice) {
  // We have an impure action creator here... no big deal I guess
  const rolls = dice.map(die_size => Math.floor((Math.random() * die_size)) + 1);

  return {
    type: ACTIONS.DICE_ROLLED,
    dice,
    rolls,
  };
}

module.exports = {
  addDice,
  rollDice,
  clearDice,
};
