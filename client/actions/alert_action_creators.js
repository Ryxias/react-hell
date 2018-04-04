'use strict';

const ACTIONS = require('./alert_actions');

function alert(message, severity = 'info') {
  return {
    type: ACTIONS.ALERT_RECIEVED,
    severity,
    message,
  };
}

function dismissAlert() {
  return {
    type: ACTIONS.ALERT_CLOSED,
  }
}

module.exports = {
  alert,
  dismissAlert,
};
