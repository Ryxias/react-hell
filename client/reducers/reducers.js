'use strict';

const { combineReducers } = require('redux');

const rootReducer = combineReducers({
  alert: require('../modules/alert').default,
  auth: require('../modules/auth').default,
  clock: require('./clock_reducer').clockReducer,
  dice: require('../modules/dice').default,
  gacha: require('../modules/gacha').default,
  gossip: require('../modules/gossip').default,
});

module.exports = rootReducer;
