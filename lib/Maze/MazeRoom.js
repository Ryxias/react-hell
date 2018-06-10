'use strict';

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

  exits() {
    return [

    ];
  }

  static fromData(room_data) {
    return new MazeRoom(room_data);
  }

  toData() {
    return this.room;
  }

}
module.exports = MazeRoom;
