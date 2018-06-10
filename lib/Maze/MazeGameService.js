'use strict';

const MazeGameState = require('./MazeGameState');
const RoomTransition = require('./RoomTransition');

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
    return this._framework(
      outcome => {
        const data = this.MazeRoomGenerator.generateRooms(2);

        const state = new MazeGameState();
        state.setCurrentRoomId(data.getStartRoomId());

        game.setData(data);
        game.setState(state);

        return game.save().then(() => outcome.message = 'Game started.');
      }
    );
  }

  look(game) {
    return this._framework(
      outcome => {
        const state = game.getState();
        const data = game.getData();

        const room = data.getRoomById(state.getCurrentRoomId());

        outcome.message = room.description();
      }
    );
  }

  move(game, direction) {
    return this._framework(
      outcome => Promise.resolve()
        .then(() => {
          // Valid direction?
          return RoomTransition.normalizeDirection(direction);
        })
        .then(normalized_direction => {
          // Can move in that direction?
          const state = game.getState();
          const data = game.getData();

          const current_room = data.getRoomById(state.getCurrentRoomId());

          if (!current_room.hasExit(normalized_direction)) {
            throw new Error('You cannot move in that direction!');
          }

          // Move in that direction
          const destination_room_id = current_room.getExit(normalized_direction).toRoomId();
          state.setCurrentRoomId(destination_room_id);

          const readable_direction = {
            [RoomTransition.DIRECTIONS.north]: 'north',
            [RoomTransition.DIRECTIONS.east]: 'east',
            [RoomTransition.DIRECTIONS.south]: 'south',
            [RoomTransition.DIRECTIONS.west]: 'west',
            [RoomTransition.DIRECTIONS.down]: 'down',
            [RoomTransition.DIRECTIONS.up]: 'up',
          }[normalized_direction];

          game.setState(state);
          return game.save()
            .then(() => outcome.message = `You went ${readable_direction}`)
            .then(() => {
              // Victory?
              if (state.getCurrentRoomId() === data.getGoalRoomId()) {
                outcome.message = 'Victory!';
              }
            })
        })
    );
  }

  _framework(code) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => code(outcome))
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome); // Always return an outcome
  }
}
module.exports = MazeGameService;
