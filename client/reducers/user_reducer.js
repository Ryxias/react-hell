'use strict';

const USER_ACTIONS = require('../actions/login_actions');


function user(state = null, action) {
  switch (action.type) {
    case USER_ACTIONS.LOGIN_START:
    case USER_ACTIONS.LOGIN_FAILURE: {
      // destroy any existing gacha card and
      // display sexy megumin or smth

      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoggingIn = true;

      return newState;

      break;
    }
    case USER_ACTIONS.LOGIN_SUCCESSFUL: {
      // we got a gacha card, save it into the redux state
      // and display the pretty envelope
      const { user } = action;

      const newState = Object.assign({}, state); // clones the old "state"

      newState.isLoggingIn = false;
      newState.user = user;

      return newState;

      break;
    }

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
    default:
      return state;
  }
}
module.exports = user;
