'use strict';

const ALERT_ACTIONS = require('../actions/alert_actions');

function alert(state = {}, action) {
  switch (action.type) {
    case ALERT_ACTIONS.ALERT_RECIEVED: {
      const newState = Object.assign({}, state);
      newState.hasAlert = true;
      newState.message = action.message;
      newState.severity = action.severity;

      return newState;
    }
    case ALERT_ACTIONS.ALERT_CLOSED: {
      const newState = Object.assign({}, state);
      newState.hasAlert = false;
      newState.message = null;
      newState.severity = null;

      return newState;
    }
    default:
      return state;
  }
}

module.exports = alert;
