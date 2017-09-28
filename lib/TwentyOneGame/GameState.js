'use strict';

/**
 * @deprecated
 */
class GameState {
  /**
   *
   */
  constructor() {
    // One game per channel
    this.channel_id = null;

    // Associative arrays keyed by the player id, mapped to individual player data, which are dicts
    // with the following keys:
    //   foreign_id =
    this.player_data = {};

    //
    this.deck = [];

    // Wild Cards
    this.wild_cards = [];
  }

  /**
   * Promisified
   *
   * Returns the current GameState object, initialized
   */
  load(channel_id) {
    this.channel_id = channel_id;
  }

  initialize(channel_id) {

  }

  getPlayerIds() {
    return Object.keys(this.player_data);
  }

  getPlayerData(player_id) {
    return this.player_data[player_id];
  }

  addPlayer(player) {
    this.player_data[player.getId()] = {
      player_id: player.getId(),
    };
  }

  setPlayerData(player_id, key) {

  }

  getPlayerRemainingLife(player_id) {
    return -1;
  }
}

module.exports = GameState;
