'use strict';

const { combineReducers } = require('redux');

const rootReducer = combineReducers({
  //gacha: require('./gacha_reducer'),
  gacha: require('../modules/gacha').default,
  user: require('./user_reducer'),
  alert: require('./alert_reducer'),
  gossip: require('./gossip_reducer'),
  clock: require('./clock_reducer').clockReducer,
  dice: require('./dice_reducer'),
});

module.exports = rootReducer;
