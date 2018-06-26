'use strict';


/**
 *
 * Game:
 *
 *  step 1 - setup
 *
 *  - players go !rps or !rock-paper-scissors to start the game
 *  - 10 seconds after the initial throw, the game is started. After starting, no players can join.
 *
 *  step 2 - wind up throw
 *
 *  - players choose a throw which gets queued up. When a throw is announced, Slackbot will respond to the message
 *    with an emoji.
 *
 *
 *  step 3 - throw
 *
 *  - 10 seconds after the game start, the throws are closed. No more throw changes can occur.
 *
 *
 *  step 4 - resolution
 *
 */
class RockPaperScissors {

  startGame(game, player) {
    return Promise.resolve()
      .then(() => {
        return this.event_handler.gameStarted();
      })
      .catch(err => {
        return this.event_handler.error(err);
      });
  }

  joinGame() {


  }

  pickThrow() {

  }

  setEventHandler(event_handler) {
    this.event_handler = event_handler;
  }
}
module.exports = RockPaperScissors;
