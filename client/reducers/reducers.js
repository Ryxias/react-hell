'use strict';

const { combineReducers } = require('redux');

const { SAMPLE_ACTION } = require('../actions/actions');

function sample(state = null, action) {
  switch (action.type) {
    case SAMPLE_ACTION:
      const newState = Object.assign({}, state, { yay: 'you did it!' });
      return newState;
      break;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  sample,
  gacha: require('./gacha_reducer'),
  user: require('./user_reducer'),
});

module.exports = rootReducer;
