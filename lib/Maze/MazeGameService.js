'use strict';

const MazeGameState = require('./MazeGameState');

class MazeGameService {
  constructor(MazeGameStore, MazeRoomGenerator) {
    this.MazeGameStore = MazeGameStore;
    this.MazeRoomGenerator = MazeRoomGenerator;
  }

  getGameBySlackChannel(slack_channel) {
    return this.MazeGameStore.findBySlackChannel(slack_channel)
      .then(game => {
        if (game) {
          return game;
        }
        return this.MazeGameStore.createForSlackChannel(slack_channel);
      });
  }

  startGame(game) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        const data = this.MazeRoomGenerator.generateRooms(2);

        const state = new MazeGameState();
        state.setCurrentRoomId(data.getStartRoomId());

        game.setData(data);
        game.setState(state);

        return game.save().then(() => outcome.message = 'Game started.');
      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome); // Always return the outcome
  }

  look(game) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        const state = game.getState();
        const data = game.getData();


      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome); // Always return the outcome
  }

  move(game, direction) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        // Valid direction?

      })
      .then(() => {
        // Can move in that direction?

      })
      .then(() => {
        // Move in that direction

      })
      .then(() => {
        // Victory?

      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome); // Always return the outcome
  }

}
module.exports = MazeGameService;
