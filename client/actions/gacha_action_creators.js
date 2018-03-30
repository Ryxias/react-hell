'use strict';

const ACTIONS = require('./gacha_actions');

function resetGacha() {
  return {
    type: ACTIONS.RESET_GACHA,
  }
}

function startGachaRoll() {
  return (dispatch, getState) => {

    dispatch({
      type: ACTIONS.START_GACHA_ROLL,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.get("/api/sif/roll")
      .then((received) => {
        console.log('Received data:', received.data);

        dispatch({
          type: ACTIONS.RECEIVE_GACHA_ROLL,
          card: received.data,
        });
      });
  };
}

function receiveGachaRoll(card_data) {
  return {
    type: ACTIONS.RECEIVE_GACHA_ROLL,
    card_data,
  }
}

function exampleActionCreator() {

  console.log('adlfkj');
  console.log('adlfkj');



}

module.exports = {
  resetGacha,
  startGachaRoll,
  receiveGachaRoll,
};
