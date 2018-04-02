'use strict';

/**
 * ???
 */
const RESET_GACHA = 'RESET_GACHA';

/**
 * Start API call to server to load the next card.
 */
const START_GACHA_ROLL = 'START_GACHA_ROLL';

/**
 * Get this when the API call returns.
 */
const RECEIVE_GACHA_ROLL = 'RECIEVE_GACHA_ROLL';

/**
 * User clicks on the envelope and begins the opening animation
 */
const START_OPEN_CARD = 'START_OPEN_CARD';

/**
 * The envelope finishes opening and renders the Aidorus
 */
const CARD_OPENED = 'CARD_OPENED';


module.exports = {
  RESET_GACHA,
  START_GACHA_ROLL,
  RECEIVE_GACHA_ROLL,
};
