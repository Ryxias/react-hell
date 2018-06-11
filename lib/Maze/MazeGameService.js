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

        game.wipe();
        game.setData(data);
        game.setState(state);

        game.addLogEntry({ action: 'startGame' });

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

        const exits = room.exits().map(room_transition => RoomTransition.toReadableDirection(room_transition.direction()));

        outcome.message = `${room.description()}
        
Exits: ${exits.join(', ')}`;
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

          game.setState(state);

          game.addLogEntry({ action: 'move', direction });

          return game.save()
            .then(() => {
              const room = data.getRoomById(state.getCurrentRoomId());
              const exits = room.exits().map(room_transition => RoomTransition.toReadableDirection(room_transition.direction()));

              outcome.message = `You went ${RoomTransition.toReadableDirection(normalized_direction)}.

${room.description()}
        
Exits: ${exits.join(', ')}              
`;
            })
            .then(() => {
              // Victory?
              if (state.getCurrentRoomId() === data.getGoalRoomId()) {
                outcome.message = `You reached the exit! Victory!`;
              }
            })
        })
    );
  }

  /**
   * Accepts a function that accepts 1 argument, outcome. The function is responsible
   * for modifying the outcome (exp. outcome.message).
   *
   * It can do this either synchronously or return a promise to async it.
   */
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
