'use strict';

const { alert } = require('../modules/alert');


// Actions
/**
 * Login
 */
const LOGIN_START = 'auth/LOGIN_START';

/**
 *
 */
const LOGIN_SUCCESSFUL = 'auth/LOGIN_SUCCESSFUL';

/**
 *
 */
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

const REGISTER_START = 'auth/REGISTER_START';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'auth/REGISTER_FAIL';

const LOGOUT_START = 'auth/LOGOUT_START';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';

const SYNCHRONIZE_LOGIN_STATE_START = 'auth/SYNCHRONIZE_LOGIN_STATE_START';
const SYNCHRONIZE_LOGIN_STATE_SUCCESS = 'auth/SYNCHRONIZE_LOGIN_STATE_SUCCESS';
const SYNCHRONIZE_LOGIN_STATE_FAILURE = 'auth/SYNCHRONIZE_LOGIN_STATE_FAILURE';

const REQUEST_SLACK_TOKEN_START = 'auth/REQUEST_SLACK_TOKEN_START';
const REQUEST_SLACK_TOKEN_SUCCESS = 'auth/REQUEST_SLACK_TOKEN_SUCCESS';
const REQUEST_SLACK_TOKEN_FAIL = 'auth/REQUEST_SLACK_TOKEN_FAIL';
const DISMISS_SLACK_TOKEN = 'auth/DISMISS_SLACK_TOKEN';

// Action creators
export function login(email, password) {
  return (dispatch, getState) => {
    if (getState().auth.isLoggingIn) {
      return Promise.resolve(false);
    }

    const AuthApiClient = getState().getContainer().get('auth_api_client');

    dispatch({ type: LOGIN_START });

    return AuthApiClient.login(email, password)
      .then(({ data, message }) => {
        dispatch({
          type: LOGIN_SUCCESSFUL,
          user: data.user,
        });
        dispatch(alert(message, 'success'));
      })
      .catch(({ message }) => {
        dispatch({ type: LOGIN_FAILURE });
        dispatch(alert(message, 'warning'));
      });
  };
}

export function logout() {
  return (dispatch, getState) => {
    if (getState().auth.isLoggingOut) {
      return Promise.resolve(false);
    }

    const AuthApiClient = getState().getContainer().get('auth_api_client');

    dispatch({ type: LOGOUT_START });

    return AuthApiClient.logout()
      .then(({ message }) => {
        dispatch({ type: LOGOUT_SUCCESS });
        dispatch(alert(message, 'success'));
      })
      .catch(({ message }) => {
        dispatch({ type: LOGOUT_FAILURE });
        dispatch(alert(message, 'warning'));
      });
  };
}

export function register(email, password) {
  return (dispatch, getState) => {
    if (getState().auth.isRegistering) {
      return Promise.resolve(false);
    }

    const AuthApiClient = getState().getContainer().get('auth_api_client');

    dispatch({ type: REGISTER_START });

    return AuthApiClient.register(email, password)
      .then(({ data, message }) => {
        dispatch({
          type: REGISTER_SUCCESS,
          user: data.user,
        });
        dispatch(alert(message, 'success'));
      })
      .catch(({ message }) => {
        dispatch({ type: REGISTER_FAIL });
        dispatch(alert(message, 'danger'));
      });
  };
}

export function synchronizeLoginState() {
  return (dispatch, getState) => {
    if (getState().auth.isSynchronizing) {
      return Promise.resolve(false);
    }

    const AuthApiClient = getState().getContainer().get('auth_api_client');

    dispatch({ type: SYNCHRONIZE_LOGIN_STATE_START });

    return AuthApiClient.whoami()
      .then(({ data }) => {
        dispatch({
          type: SYNCHRONIZE_LOGIN_STATE_SUCCESS,
          user: data.user,
          ts: Date.now(),
        });
        //dispatch(alert(response.data.message, 'success'));
      })
      .catch((error) => {
        dispatch({ type: SYNCHRONIZE_LOGIN_STATE_FAILURE });
        //dispatch(alert(message, 'danger'));
      });
  };
}

export function requestSlackToken() {
  return (dispatch, getState) => {
    if (getState().auth.isFetchingSlackToken) {
      return Promise.resolve(false);
    }

    const AuthApiClient = getState().getContainer().get('auth_api_client');

    dispatch({ type: REQUEST_SLACK_TOKEN_START });

    return AuthApiClient.requestSlackToken()
      .then(({ data }) => {
        dispatch({
          type: REQUEST_SLACK_TOKEN_SUCCESS,
          slack_token: data.slack_token,
          use_command: data.use_command,
        });
        //dispatch(alert(response.data.message, 'success'));
      })
      .catch(({ message }) => {
        dispatch({ type: REQUEST_SLACK_TOKEN_FAIL });
        dispatch(alert(message, 'danger'));
      });
  };
}

export function dismissSlackToken() {
  return { type: DISMISS_SLACK_TOKEN };
}

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    // Login
    case LOGIN_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoggingIn = true;

      return newState;
    }
    case LOGIN_FAILURE: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoggingIn = false;

      return newState;
    }
    case LOGIN_SUCCESSFUL: {
      const { user } = action;

      const newState = Object.assign({}, state); // clones the old "state"

      newState.isLoggingIn = false;
      newState.user = user;

      return newState;
    }

    // Logout
    case LOGOUT_START: {
      const newState = Object.assign({}, state);
      newState.isLoggingOut = true;

      return newState;
    }
    case LOGOUT_SUCCESS:
    case LOGOUT_FAILURE: {
      const newState = Object.assign({}, state);
      newState.user = {};
      newState.isLoggingOut = false;

      return newState;
    }

    // Register
    case REGISTER_START: {
      const newState = Object.assign({}, state);

      newState.isRegistering = true;

      return newState;
    }
    case REGISTER_SUCCESS: {
      const { user } = action;

      const newState = Object.assign({}, state);

      newState.isRegistering = false;
      newState.user = user;

      return newState;
    }

    case REGISTER_FAIL: {
      const newState = Object.assign({}, state);
      newState.isRegistering = false;

      return newState;
    }

    // Synchronize
    case SYNCHRONIZE_LOGIN_STATE_START: {
      const newState = Object.assign({}, state);
      newState.isSynchronizing = true;

      return newState;
    }
    case SYNCHRONIZE_LOGIN_STATE_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.isSynchronizing = false;
      newState.user = action.user;
      newState.lastChecked = action.ts;

      return newState;
    }
    case SYNCHRONIZE_LOGIN_STATE_FAILURE: {
      const newState = Object.assign({}, state);
      newState.isSynchronizing = false;
      newState.user = {}; // Assume they're just not logged in... they can synchronize again later

      return newState;
    }

    // Slack connector
    case REQUEST_SLACK_TOKEN_START: {
      const newState = Object.assign({}, state);
      newState.isFetchingSlackToken = true;
      newState.slackToken = '';

      return newState;
    }
    case REQUEST_SLACK_TOKEN_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.isFetchingSlackToken = false;
      newState.slackToken = action.slack_token;
      newState.useCommand = action.use_command;

      return newState;
    }
    case REQUEST_SLACK_TOKEN_FAIL: {
      const newState = Object.assign({}, state);
      newState.isFetchingSlackToken = false;

      return newState;
    }
    case DISMISS_SLACK_TOKEN: {
      const newState = Object.assign({}, state);
      newState.slackToken = '';
      newState.useCommand = '';
      newState.isFetchingSlackToken = false;

      return newState;
    }

    // Defaults
    default:
      return state;
  }
}
