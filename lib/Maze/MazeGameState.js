'use strict';

class MazeGameState {
  constructor(state = {}) {
    this.state = state;
  }

  getCurrentRoomId() {
    return this.state.current_room_id;
  }

  setCurrentRoomId(room_id) {
    return this.state.current_room_id = room_id;
  }

  static fromDb(state_string) {
    return new MazeGameState(JSON.parse(state_string));
  }


  toDb() {
    return JSON.stringify(this.state);
  }

}
module.exports = MazeGameState;
