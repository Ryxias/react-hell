'use strict';

const USER_ACTIONS = require('../actions/login_actions');


function user(state = null, action) {
  switch (action.type) {
    // Login
    case USER_ACTIONS.LOGIN_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoggingIn = true;

      return newState;
      break;
    }
    case USER_ACTIONS.LOGIN_FAILURE: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoggingIn = false;

      return newState;
      break;
    }
    case USER_ACTIONS.LOGIN_SUCCESSFUL: {
      const { user } = action;

      const newState = Object.assign({}, state); // clones the old "state"

      newState.isLoggingIn = false;
      newState.user = user;

      return newState;
      break;
    }

    // Logout
    case USER_ACTIONS.LOGOUT_START: {
      const newState = Object.assign({}, state);
      newState.isLoggingOut = true;

      return newState;
      break;
    }
    case USER_ACTIONS.LOGOUT_SUCCESS:
    case USER_ACTIONS.LOGOUT_FAILURE: {
      const newState = Object.assign({}, state);
      newState.user = {};
      newState.isLoggingOut = false;

      return newState;

      break;
    }

    // Register
    case USER_ACTIONS.REGISTER_START: {
      const newState = Object.assign({}, state);

      newState.isRegistering = true;

      return newState;
      break;
    }
    case USER_ACTIONS.REGISTER_SUCCESS: {
      const { user } = action;

      const newState = Object.assign({}, state);

      newState.isRegistering = false;
      newState.user = user;

      return newState;
      break;
    }

    case USER_ACTIONS.REGISTER_FAIL: {
      const newState = Object.assign({}, state);
      newState.isRegistering = false;

      return newState;

      break;
    }

    // Synchronize
    case USER_ACTIONS.SYNCHRONIZE_LOGIN_STATE_START: {
      const newState = Object.assign({}, state);
      newState.isSynchronizing = true;

      return newState;
    }
    case USER_ACTIONS.SYNCHRONIZE_LOGIN_STATE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.isSynchronizing = false;
      newState.user = action.user;

      return newState;
    }
    case USER_ACTIONS.SYNCHRONIZE_LOGIN_STATE_FAILURE: {
      const newState = Object.assign({}, state);
      newState.isSynchronizing = false;
      newState.user = {}; // Assume they're just not logged in... they can synchronize again later

      return newState;
    }


    // Defaults
    default:
      return state;
  }
}
module.exports = user;
