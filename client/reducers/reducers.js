'use strict';

const { combineReducers } = require('redux');

const rootReducer = combineReducers({
  gacha: require('../modules/gacha').default,
  user: require('./user_reducer'),
  alert: require('../modules/alert').default,
  gossip: require('../modules/gossip').default,
  clock: require('./clock_reducer').clockReducer,
  dice: require('../modules/dice').default,
});

module.exports = rootReducer;
