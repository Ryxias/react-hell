'use strict';

const axios = require('axios');
const { alert } = require('../modules/alert');


// Actions
/**
 * Login
 */
const LOGIN_START = 'LOGIN_START';

/**
 *
 */
const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';

/**
 *
 */
const LOGIN_FAILURE = 'LOGIN_FAILURE';

const REGISTER_START = 'REGISTER_START';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAIL = 'REGISTER_FAIL';

const LOGOUT_START = 'LOGOUT_START';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

const SYNCHRONIZE_LOGIN_STATE_START = 'SYNCHRONIZE_LOGIN_STATE_START';
const SYNCHRONIZE_LOGIN_STATE_SUCCESS = 'SYNCHRONIZE_LOGIN_STATE_SUCCESS';
const SYNCHRONIZE_LOGIN_STATE_FAILURE = 'SYNCHRONIZE_LOGIN_STATE_FAILURE';

const REQUEST_SLACK_TOKEN_START = 'REQUEST_SLACK_TOKEN_START';
const REQUEST_SLACK_TOKEN_SUCCESS = 'REQUEST_SLACK_TOKEN_SUCCESS';
const REQUEST_SLACK_TOKEN_FAIL = 'REQUEST_SLACK_TOKEN_FAIL';
const DISMISS_SLACK_TOKEN = 'DISMISS_SLACK_TOKEN';

// Action creators
export function login(email, password) {
  return (dispatch, ownState) => {
    dispatch({ type: LOGIN_START });

    return axios.post("/api/login", {
      email,
      password,
    })
      .then(response => {
        dispatch({
          type: LOGIN_SUCCESSFUL,
          user: response.data.user,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: LOGIN_FAILURE,
          message,
          err,
        });
        dispatch(alert(message, 'warning'));
      });
  };
}

export function logout() {
  return (dispatch, ownState) => {
    dispatch({
      type: LOGOUT_START,
    });

    return axios.post('/api/logout')
      .then(response => {
        dispatch({
          type: LOGOUT_SUCCESS,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: LOGOUT_FAILURE,
          error: err,
          message
        });
        dispatch(alert(message, 'warning'));
      });
  };
}

export function register(email, password) {
  return (dispatch, getState) => {

    dispatch({
      type: REGISTER_START,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.post("/api/register", {
      email,
      password
    })
      .then(response => {
        dispatch({
          type: REGISTER_SUCCESS,
          user: response.data.user,
          response_data: response.data,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: REGISTER_FAIL,
          error: err,
        });
        dispatch(alert(message, 'danger'));
      });
  };
}

export function synchronizeLoginState() {
  return (dispatch, ownState) => {
    dispatch({
      type: SYNCHRONIZE_LOGIN_STATE_START,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.get("/api/whoami")
      .then(response => {
        dispatch({
          type: SYNCHRONIZE_LOGIN_STATE_SUCCESS,
          user: response.data.user,
          response_data: response.data,
        });
        //dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: SYNCHRONIZE_LOGIN_STATE_FAILURE,
          error: err,
        });
        //dispatch(alert(message, 'danger'));
      });
  };
}

export function requestSlackToken() {
  return (dispatch, ownState) => {
    dispatch({
      type: REQUEST_SLACK_TOKEN_START,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.post("/api/slack_token")
      .then(response => {
        dispatch({
          type: REQUEST_SLACK_TOKEN_SUCCESS,
          slack_token: response.data.slack_token,
          use_command: response.data.use_command,
          response_data: response.data,
        });
        //dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: REQUEST_SLACK_TOKEN_FAIL,
          error: err,
        });
        dispatch(alert(message, 'danger'));
      });
  };
}

export function dismissSlackToken() {
  return {
    type: DISMISS_SLACK_TOKEN,
  };
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
