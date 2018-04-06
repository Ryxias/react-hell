'use strict';

const { combineReducers } = require('redux');

const rootReducer = combineReducers({
  gacha: require('./gacha_reducer'),
  user: require('./user_reducer'),
  alert: require('./alert_reducer'),
  gossip: require('./gossip_reducer'),
});

module.exports = rootReducer;
