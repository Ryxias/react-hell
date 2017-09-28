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
      return Promise.resolve(new Player(player_id, this));
    }
    return Promise.reject(new Error(`You are not part of this game! The players are: [${this.getPlayerIds()}] [0007JPWQJD]`));
  }

  startGame() {
    if (this.model_data.game_started) {
      return Promise.reject(new Error('The game has already started... [0004WQPWHFEW]'));
    }

    this.model_data.game_started = true;

    // FIXME
    // Shuffle the deck
    this.model_data.deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    // select first player
    let players = this.getPlayerIds();
    this.model_data.player_turn = players[Math.floor(Math.random() * 2)];

    return this.saveGame();
  }

  whosTurn() {
    if (!this.model_data.game_started) {
      return Promise.reject(new Error('The game has not yet started [0001ABFEURQWJ]'));
    }
    return Promise.resolve(this.model_data.player_turn);
  }

  addPlayer(player) {
    if (this.model_data.game_started) {
      return Promise.reject(new Error('The game has already started... [0017PMQCNWPW]'));
    }
    this.model_data.player_data[player.getId()] = {
      player_id: player.getId(),
    };

    return this.saveGame();
  }

  removePlayer(player) {
    if (this.model_data.game_started) {
      return Promise.reject(new Error('The game has already started... [0022QOQSMMPS]'));
    }
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
