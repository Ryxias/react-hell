'use strict';

const RoomTransition = require('./RoomTransition');

class MazeRoom {

  constructor(room = {}) {
    this.room = room;
  }

  id() {
    return this.room.id;
  }

  coordinates() {
    return {
      x: this.room.x_coordinate,
      y: this.room.y_coordinate,
    };
  }

  description() {
    return this.room.description;
  }

  /**
   * @return RoomTransition[]
   */
  exits() {
    const exits = this.room.exits || {};
    return Object.keys(exits).map(direction => {
      const target_room = exits[direction];
      return new RoomTransition(target_room, direction);
    });
  }

  /**
   * @param direction
   * @returns {RoomTransition}
   */
  getExit(direction) {
    return this.exits().find(exit => direction === exit.direction());
  }

  /**
   * @param direction
   * @returns {boolean}
   */
  hasExit(direction) {
    return !!this.getExit(direction);
  }

  static fromData(room_data) {
    return new MazeRoom(room_data);
  }

  toData() {
    return this.room;
  }

}
module.exports = MazeRoom;
