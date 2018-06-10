'use strict';

class RoomTransition {

  constructor(room_id, direction) {
    this._room_id = room_id;
    this._direction = direction;
  }

  toRoomId() {
    return this._room_id;
  }

  direction() {
    return this._direction;
  }

  static normalizeDirection(direction) {
    switch (direction.toLowerCase()) {
      case 'north':
      case 'n':
        return RoomTransition.DIRECTIONS.north;
      case 'south':
      case 's':
        return RoomTransition.DIRECTIONS.south;
      case 'east':
      case 'e':
        return RoomTransition.DIRECTIONS.east;
      case 'west':
      case 'w':
        return RoomTransition.DIRECTIONS.west;
      case 'up':
      case 'u':
        return RoomTransition.DIRECTIONS.up;
      case 'down':
      case 'd':
        return RoomTransition.DIRECTIONS.down;
      default:
        throw new Error(`Invalid direction: ${direction}.`);
    }
  }
}

RoomTransition.DIRECTIONS = {
  north: 'n',
  east: 'e',
  south: 's',
  west: 'w',
  up: 'u',
  down: 'd',
};

module.exports = RoomTransition;
