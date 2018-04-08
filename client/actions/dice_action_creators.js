'use strict';

const ACTIONS = require('./dice_actions');

function addDice(die_size) {
  return {
    type: ACTIONS.ADD_DICE,
    die_size,
  };
}

module.exports = {

};
