'use strict';

class MazeRoomGenerator {

  generateRooms(dimensions) {
    return {
      start: 1,
      rooms: {
        1: {
          x_coordinate: 0,
          y_coordinate: 0,
          description: 'There is a room',
          exits: {
            e: 2,
          },
        },
        2: {
          x_coordinate: 1,
          y_coordinate: 0,
          description: 'There is another room',
          exits: {
            n: 3,
            w: 1,
          },
        },
        3: {
          x_coordinate: 0,
          y_coordinate: 1,
          description: 'There is a third room',
          exits: {
            s: 2,
            w: 4,
          },
        },
        4: {
          x_coordinate: 1,
          y_coordinate: 1,
          description: 'There is the last room',
          exits: {
            e: 3,
            u: 99,
          },
        },
        99: {
          x_coordinate:99,
          y_coordinate:99,
          description: 'Yay you made it to the end!',
          exits: {},
        }
      },
    };
  }

}
module.exports = MazeRoomGenerator;
