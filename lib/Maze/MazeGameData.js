'use strict';

const MazeRoom = require('./MazeRoom');

class MazeGameData {
  constructor(data) {
    this.data = data;
  }

  getStartRoomId() {
    return this.data.start;
  }

  getGoalRoomId() {
    return this.data.end;
  }

  getRoomIds() {
    return Object.keys(this.data.rooms);
  }

  /**
   * @returns {MazeRoom[]}
   */
  getRooms() {
    return this.getRoomIds().map(room_id => {
      return this.getRoomById(room_id);
    });
  }

  /**
   * @param room_id
   * @returns MazeRoom
   */
  getRoomById(room_id) {
    return MazeRoom.fromData(this.data.rooms[room_id]);
  }

  addRoom(maze_room) {

  }



  static fromDb(state_string) {
    return new MazeGameData(JSON.parse(state_string));
  }


  toDb() {
    return JSON.stringify(this.data);
  }

}
module.exports = MazeGameData;
