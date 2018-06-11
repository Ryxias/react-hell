'use strict';

const MazeRoom = require('./MazeRoom');

class MazeGameData {
  constructor(data = {}) {
    this.data = data;
  }

  addRoom(room) {
    this.data.rooms = this.data.rooms || {};
    if (this.data.room[room.id()]) {
      throw new Error(`addRoom() Conflict on room id: ${room.id()}`);
    }
    this.data.rooms[room.id()] = room;
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
   * @return {MazeRoom}|null
   */
  getRoomByCoordinates(x, y) {
    // Can optimize this guy using some sort of index.
    return this.getRooms().find(room => {
      const c = room.coordinates();
      return c.x === x && c.y === y;
    });
  }

  /**
   * Returns the neighboring rooms to this one BY GEOGRAPHY. The neighbors don't necessarily
   *
   * @return {MazeRoom[]}
   */
  getAdjacentRoomsTo(room) {
    const neighbors = [];
    [ {dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:0},{dx:-1,dy:0} ].forEach(({dx, dy}) => {
      const coordinates = room.coordinates();
      const maybe_room = this.getRoomByCoordinates(coordinates.x + dx, coordinates.y + dy);
      if (maybe_room) {
        neighbors.push(maybe_room);
      }
    });
    return neighbors;
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


  static fromDb(state_string) {
    return new MazeGameData(JSON.parse(state_string));
  }


  toDb() {
    return JSON.stringify(this.data);
  }

}
module.exports = MazeGameData;
