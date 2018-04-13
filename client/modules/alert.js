'use strict';

// Actions

const ALERT_RECIEVED = 'alert/ALERT_RECEIVED';
const ALERT_CLOSED = 'alert/ALERT_CLOSED';

// Action Creators

export function alert(message, severity = 'info') {
  return {
    type: ALERT_RECIEVED,
    severity,
    message,
  };
}

export function dismissAlert() {
  return {
    type: ALERT_CLOSED,
  }
}

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case ALERT_RECIEVED: {
      const newState = Object.assign({}, state);
      newState.hasAlert = true;
      newState.message = action.message;
      newState.severity = action.severity;

      return newState;
    }
    case ALERT_CLOSED: {
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
