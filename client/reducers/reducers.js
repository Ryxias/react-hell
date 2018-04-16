'use strict';

const { combineReducers } = require('redux');

const rootReducer = combineReducers({
  alert: require('../modules/alert').default,
  auth: require('../modules/auth').default,
  clock: require('../modules/clock').default,
  dice: require('../modules/dice').default,
  gacha: require('../modules/gacha').default,
  gossip: require('../modules/gossip').default,

  // FIXME (derek) hacky?
  getContainer: (state = {}, action = {}) => state,
});

module.exports = rootReducer;
