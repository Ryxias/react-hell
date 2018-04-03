'use strict';

const axios = require('axios');
const ACTIONS = require('./login_actions');

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
      })
      .catch(err => {
        dispatch({
          type: ACTIONS.LOGIN_FAILURE,
          err,
        });
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
      })
      .catch(err => {
        dispatch({
          type: ACTIONS.LOGOUT_FAILURE,
        });
      });
  };
}

function register(email, password) {
  return (dispatch, getState) => {

    dispatch({
      type: ACTIONS.REGISTER_START,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.get("/api/register", {
      email,
      password
    })
      .then(response => {
        dispatch({
          type: ACTIONS.REGISTER_SUCCESS,
          user: response.data.user,
          response_data: response.data,
        });
      })
      .catch(err => {
        dispatch({
          type: ACTIONS.REGISTER_FAIL,
        });
      });
  };
}

module.exports = {
  login,
  logout,
  register,
};
