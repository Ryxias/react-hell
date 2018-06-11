'use strict';

const lodash = require('lodash');

class RoomRepo {

  static normalRooms() {
    return [
      'This is a room.',
      'This is another room.',
      'You are in a room.',
      'There are things in this room.',
      'This room looks pretty normal.',
      'There are interesting things in this room.',
      'You are probably in a room.',
      'Rooms are nice.',
      'This room has a thing in it.',
      'This room is that.',
      'You enter a pretty good room.',
      'There is a room.',
      `Who's room are you in?`,
      'Some room is here.',
      `I guess you're in a room.`,
    ];
  }

  static random() {
    return lodash.sample(this.normalRooms());
  }


}
module.exports = RoomRepo;
