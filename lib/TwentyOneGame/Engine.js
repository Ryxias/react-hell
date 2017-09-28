'use strict';

const Player = require('./Player');

/**
 * This class contains all of the logic and state of the game
 */
class Engine {
  constructor(context, context_id) {
    // One game per channel
    this.key = `21-game-${context}-${context_id}`;

    this.model = null;
    this.model_data = null;
  }

  /**
   * Promise
   *
   * Populates this.model and this.model_data properly
   */
  load() {
    return GenericGameState.findOne({ where: { name: this.key } })
      .then(model => {
        if (model) {
          this.model = model;
          this.model_data = JSON.parse(this.model.state) || {};
        } else {
          this.model_data = {
            key: this.key,
            player_data: {},
            deck: [],
            game_started: false,
          };

          return GenericGameState.create(
            {
              name: this.key,
              state: JSON.stringify(this.model_data),
            }
          )
            .then(model => {
              this.model = model;
            });
        }

        return null;
      });
  }

  getPlayerIds() {
    return Object.keys(this.model_data.player_data);
  }

  getPlayer(player_id) {
    if (this.model_data.player_data[player_id]) {
      return new Player(player_id, this);
    }
    throw new Error(`You are not part of this game! The players are: [${Object.keys(this.getPlayerIds())}]`);
  }

  startGame() {
    if (this.model_data.game_started) {
      throw new Error('The game has already started...');
    }

    this.model_data.deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    return this.saveGame();
  }

  addPlayer(player) {
    this.model_data.player_data[player.getId()] = {
      player_id: player.getId(),
    };

    return this.saveGame();
  }

  removePlayer(player) {
    this.model_data.player_data[player.getId()] = undefined;

    return this.saveGame();
  }

  /**
   * Promise
   *
   * Pushes this.model_data and this.model to the database
   */
  saveGame() {
    this.model.state = JSON.stringify(this.model_data);
    return this.model.save();
  }
}

module.exports = Engine;
