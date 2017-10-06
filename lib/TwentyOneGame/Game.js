'use strict';

const Engine = require('./Engine');
const Player = require('./Player');
const Output = require('./Output');
const { GameState } = require('./GameState');

/**
 * The game is a facade that exposes only methods that directly face the rest of the application code.
 * The rest of the actions all must be taken through the Player objects.
 */
class Game {
  constructor(context, context_id, send, send_private) {
    this.context = context;
    this.context_id = context_id;

    this.default_output = new Output(send, send_private);

    this.engine = null;
  }

  /**
   * @returns {Promise}
   */
  debugGetGameState() {
    return this.getEngine().then(engine => {
      return engine.game_state;
    });
  }

  /**
   * @returns {Promise}
   */
  debugSetGameState(state) {
    return this.getEngine()
      .then(engine => {
        engine.game_state = new GameState();
        engine.game_state.unserialize(JSON.stringify(state)); // FIXME i guess?
        return engine.saveGame();
      })
      .then(() => {
        return this;
      });
  }

  /**
   * In general, do not call this method directly from outside this class.
   * You can use debugGetGameState() instead
   *
   * @returns {Promise}
   */
  getEngine() {
    if (!this.engine) {
      let engine = new Engine(this.context, this.context_id);
      return engine.load().then(engine => {
        this.engine = engine;
        return engine;
      });
    } else {
      return Promise.resolve(this.engine);
    }
  }

  /**
   * Promise returns Player or throws an error when no player and outputs
   */
  getPlayer(player_id) {
    return this.getEngine()
      .then(engine => {
        return engine.getPlayer(player_id);
      })
      .then(player => {
        player.setOutput(this.default_output);
        return player;
      })
      .catch(err => {
        this.default_output.send(err.message);
        throw err;
      });
  }

  /**
   * Promise returns array of all Players in the game
   */
  getPlayers() {
    return this.getEngine()
      .then(engine => {
        let player_ids = engine.getPlayerIds();
        Promise.map(player_ids, function(player_id) {
          return engine.getPlayer(player_id);
        });
      })
      .then(players => players);
  }

  addPlayer(player_id) {
    return this.getEngine().then(engine => {
      let player = new Player(player_id, engine, this.default_output);
      return player.joinGame().then(() => player); // Return the added player
    });
  }

  /**
   * Returns a promise to get the game result
   */
  getGameResults() {
    return this.getEngine()
      .then(engine => {
        return engine.gameResults();
      });
  }

  /**
   * Promise
   */
  save() {
    return this.engine.saveGame();
  }
}

module.exports = Game;
