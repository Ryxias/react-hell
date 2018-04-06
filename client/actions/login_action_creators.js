'use strict';

const axios = require('axios');
const ACTIONS = require('./login_actions');

const { alert } = require('./alert_action_creators');

function login(email, password) {
  return (dispatch, ownState) => {
    dispatch({
      type: ACTIONS.LOGIN_START,
    });

    return axios.post("/api/login", {
      email,
      password,
    })
      .then(response => {
        dispatch({
          type: ACTIONS.LOGIN_SUCCESSFUL,
          user: response.data.user,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ACTIONS.LOGIN_FAILURE,
          message,
          err,
        });
        dispatch(alert(message, 'warning'));
      });
  };
}

function logout() {
  return (dispatch, ownState) => {
    dispatch({
      type: ACTIONS.LOGOUT_START,
    });

    return axios.post('/api/logout')
      .then(response => {
        dispatch({
          type: ACTIONS.LOGOUT_SUCCESS,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ACTIONS.LOGOUT_FAILURE,
          error: err,
          message
        });
        dispatch(alert(message, 'warning'));
      });
  };
}

function register(email, password) {
  return (dispatch, getState) => {

    dispatch({
      type: ACTIONS.REGISTER_START,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.post("/api/register", {
      email,
      password
    })
      .then(response => {
        dispatch({
          type: ACTIONS.REGISTER_SUCCESS,
          user: response.data.user,
          response_data: response.data,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ACTIONS.REGISTER_FAIL,
          error: err,
        });
        dispatch(alert(message, 'danger'));
      });
  };
}

module.exports = {
  login,
  logout,
  register,
};
