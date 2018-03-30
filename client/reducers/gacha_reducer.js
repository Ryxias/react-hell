'use strict';

const GACHA_ACTIONS = require('../actions/gacha_actions');


function gacha(state = null, action) {
  switch (action.type) {
    case GACHA_ACTIONS.RESET_GACHA:
    case GACHA_ACTIONS.START_GACHA_ROLL: {
      // destroy any existing gacha card and
      // display sexy megumin or smth

      const newState = Object.assign({}, state); // clones the old "state"
      newState.card = {};
      newState.loading = true;

      return newState;

      break;
    }
    case GACHA_ACTIONS.RECEIVE_GACHA_ROLL: {
      // we got a gacha card, save it into the redux state
      // and display the pretty envelope
      const { card } = action;

      const newState = Object.assign({}, state, {
        card: {
          card_title: card.card_title,
          card_ext_link: card.card_ext_link,
          card_image_url: card.card_image_url,
          rarity: card.rarity,
          envelope_image_closed: card.envelope_image_closed,
          envelope_image_open: card.envelope_image_open,
          open_sound: card.open_sound
        },
      });
      newState.loading = false;

      return newState;

      break;
    }
    default:
      return state;
  }
}
module.exports = gacha;
