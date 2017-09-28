'use strict';

const Output = require('./Output');

/**
 * An encapsulation of Actors in the game that can connect to the gamestate.
 *
 * Players should not contain any logic and should only tap into the game engine.
 */
class Player {
  constructor(player_id, engine, output = null) {
    this.player_id = player_id;
    this.engine = engine;
    this.output = output || new Output();
  }

  setOutput(output) {
    this.output = output;
  }

  getId() {
    return this.player_id;
  }

  joinGame() {
    return this.engine.addPlayer(this)
      .then(() => {
        this.output.send(`Player ${this.player_id} joined!`);
      });
  }

  leaveGame() {
    return this.engine.removePlayer(this)
      .then(() => {
        this.output.send(`Player ${this.player_id} left!`);
      })
  }

  startGame() {
    this.engine.startGame()
      .then(() => {
        this.output.send(`The game has begun!`);
      });
  }

  whoami() {
    this.output.send(`You're player ${this.player_id}!`);
  }

  whosTurn() {
    this.output.send('Your turn!');
  }

  draw() {
    this.output.send('You drew a 1');
  }

  stay() {
    this.output.send('You stay');
  }

  getCurrentCards() {
    this.output.send('You have a [?] and a 6');
    this.output.private('Your facedown card is a 4');
  }

  getOpponentCards() {

  }

  getPowerWords() {

  }

  playPowerWord(power_word) {

  }

  debug() {

  }
}

module.exports = Player;
