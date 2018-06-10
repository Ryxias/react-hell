'use strict';

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
      })
  }

  startGame(game) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        const data = this.MazeRoomGenerator.generateRooms(2);

        const state = {
          current_position: data.start,
        };

        game.setData(data);
        game.setState(state);

        return game.save();
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

      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome); // Always return the outcome
  }

  move(game, direction) {

  }

}
module.exports = MazeGameService;
