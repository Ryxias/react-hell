'use strict';

const Engine = require('./Engine');
const Player = require('./Player');
const Output = require('./Output');

/**
 * The game is a facade that exposes only methods that directly face the rest of the application code.
 * The rest of the actions all must be taken through the Player objects.
 */
class Game {
  constructor(context, context_id, send) {
    this.context = context;
    this.context_id = context_id;
    this.send = send;
    this.engine = null;
  }

  /**
   * Promise
   */
  getEngine() {
    if (!this.engine) {
      this.engine = new Engine(this.context, this.context_id);
      return this.engine.load()
        .then(() => {
          return this.engine;
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
        player.setOutput(new Output(this.send));
        return player;
      })
      .catch(err => {
        this.send(err.message);
        throw err;
      });
  }

  addPlayer(player_id) {
    return this.getEngine().then(engine => {
      let player = new Player(player_id, engine, new Output(this.send));
      return player.joinGame();
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
