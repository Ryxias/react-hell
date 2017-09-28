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

    this.error_handler = (function(err) {
      this.output.send(err.message);
    }).bind(this);
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
      })
      .catch(this.error_handler);
  }

  leaveGame() {
    return this.engine.removePlayer(this)
      .then(() => {
        this.output.send(`Player ${this.player_id} left!`);
      })
      .catch(this.error_handler);
  }

  kickPlayer(player_id) {
    // FIXME
  }

  startGame() {
    return this.engine.startGame()
      .then(() => {
        this.output.send(`The game has begun!`);
      })
      .catch(this.error_handler);
  }

  whoami() {
    this.output.send(`You're player ${this.player_id}!`);
  }

  whosTurn() {
    return this.engine.whosTurn()
      .then(player_id => {
        if (this.getId() === player_id) {
          this.output.send('Your turn!');
        } else {
          this.output.send(`Player ${player_id}'s turn`);
        }
      })
      .catch(this.error_handler);
  }

  whosPlaying() {
    this.output.send(`Players are: [${this.engine.getPlayerIds()}]`);
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
