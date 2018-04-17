'use strict';

import { alert } from './alert';

// A module file for gacha. Inspired by ducks
// https://medium.com/@scbarrus/the-ducks-file-structure-for-redux-d63c41b7035c
// And the futuristic:
//   https://github.com/erikras/ducks-modular-redux

// ACTIONS
const SHARE_STARTED = 'gacha/SHARE_STARTED';
const SHARE_SUCCESS = 'gacha/SHARE_SUCCESS';
const SHARE_FAILURE = 'gacha/SHARE_FAILURE';
/**
 * ???
 */
const RESET_GACHA = 'gacha/RESET_GACHA';

/**
 * Start API call to server to load the next card.
 */
const START_GACHA_ROLL = 'gacha/START_GACHA_ROLL';

/**
 * Get this when the API call returns.
 */
const RECEIVE_GACHA_ROLL = 'gacha/RECIEVE_GACHA_ROLL';

/**
 * User clicks on the envelope and begins the opening animation
 */
const START_OPEN_CARD = 'gacha/START_OPEN_CARD';

/**
 * The envelope finishes opening and renders the Aidorus
 */
const CARD_OPENED = 'gacha/CARD_OPENED';


// ACTION CREATORS
export function shareCard(card_id, idolized = false) {
  return (dispatch, getState) => {
    dispatch({
      type: SHARE_STARTED,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.post("/api/sif/share", { card_id, idolized })
      .then(received => {
        dispatch({
          type: SHARE_SUCCESS,
          data: received.data,
        });
      })
      .catch(err => {
        dispatch({
          type: SHARE_FAILURE,
          data: err.response.data,
        });
        dispatch(alert(err.response.data.message));
      });
  };
}

export function resetGacha() {
  return {
    type: RESET_GACHA,
  }
}

export function startGachaRoll() {
  return (dispatch, getState) => {

    dispatch({
      type: START_GACHA_ROLL,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.get("/api/sif/roll")
      .then((received) => {
        dispatch({
          type: RECEIVE_GACHA_ROLL,
          card: received.data,
        });
      });
  };
}


// REDUCER
export default function reducer(state = {}, action) {
  switch (action.type) {
    case RESET_GACHA:
    case START_GACHA_ROLL: {
      // destroy any existing gacha card and
      // display sexy megumin or smth

      const newState = Object.assign({}, state); // clones the old "state"
      newState.card = {};
      newState.loading = true;

      return newState;
    }
    case RECEIVE_GACHA_ROLL: {
      // we got a gacha card, save it into the redux state
      // and display the pretty envelope
      const { card } = action;

      const newState = Object.assign({}, state, {
        card: {
          id: card.id,
          card_title: card.card_title,
          card_ext_link: card.card_ext_link,
          card_image_url: card.card_image_url,
          card_idolized_image_url: card.card_idolized_image_url,
          rarity: card.rarity,
          envelope_image_closed: card.envelope_image_closed,
          envelope_image_open: card.envelope_image_open,
          open_sound: new Audio('/statics/sound/' + card.open_sound),
          card_stats: card.card_stats,
        },
      });
      newState.loading = false;

      return newState;
    }
    default:
      return state;
  }
}

