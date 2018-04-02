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
        console.log(response);
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

function register(username, password) {
  return (dispatch, getState) => {

    dispatch({
      type: 'prototyp',
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.get("/api/sif/roll")
      .then((received) => {
        dispatch({
          type: ACTIONS.RECEIVE_GACHA_ROLL,
          card: received.data,
        });
      });
  };
}

module.exports = {
  login
};
