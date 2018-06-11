'use strict';

const lodash = require('lodash');

const MazeGameData = require('./MazeGameData');
const RoomTransition = require('./RoomTransition');
const RoomRepo = require('./RoomRepo');
const MazeRoom = require('./MazeRoom');

class MazeRoomGenerator {

  generate({ random_seed, dimensions }) {
    const game_data = new MazeGameData();

    // Generate the rooms in the given dimensions
    (function createRooms() {
      let room_id = 0;
      lodash.range(5).forEach(x_coordinate => {
        lodash.range(5).forEach(y_coordinate => {
          room_id += 1;
          game_data.addRoom(new MazeRoom({
            id: room_id,
            x_coordinate,
            y_coordinate,
            description: RoomRepo.random(),
            exits: {},
          }));
        });
      });
    })();



    // Generate the edges
    // http://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm#
    //
    // - Let C be a list of cells, initially empty. Add one cell to C, at random.
    // - Choose a cell from C, and carve a passage to any unvisited neighbor of that cell, adding that
    //    neighbor to C as well. If there are no unvisited neighbors, remove the cell from C.
    // - Repeat #2 until C is empty.
    const edges = (() => {
      const C = [];
      const visited = [];

      // Pick a random room to start
      const start_room = lodash.sample(game_data.getRooms());
      C.push(start_room.id());

      while (C.length > 0) {
        // " ... But the fun lies in how you choose the cells from C, in step #2. If you always choose
        // the newest cell (the one most recently added), you’ll get the recursive backtracker. If you
        // always choose a cell at random, you get Prim’s. It’s remarkably fun to experiment with other
        // ways to choose cells from C..."
        const room_id = lodash.sample(C); // random means Prim's
        const room = game_data.getRoomById(room_id);
        const cell_coordinates = room.coordinates();

        const adjacent_rooms = game_data.getAjacentRoomsTo(room);
        if (adjacent_rooms.length > 0) {
          const neighbor = lodash.sample(adjacent_rooms);
          const edge = {

          };
          continue;
        }

        lodash.remove(C, val => val === room_id);
      }

    })();


    // Determine start/end
    //

  }

  generateRooms() {
    return new MazeGameData({
      start: 1,
      end: 99,
      rooms: {
        1: {
          id: 1,
          x_coordinate: 0,
          y_coordinate: 0,
          description: 'There is a room',
          exits: {
            [RoomTransition.DIRECTIONS.east]: 2,
          },
        },
        2: {
          id: 2,
          x_coordinate: 1,
          y_coordinate: 0,
          description: 'There is another room',
          exits: {
            [RoomTransition.DIRECTIONS.north]: 3,
            [RoomTransition.DIRECTIONS.west]: 1,
          },
        },
        3: {
          id: 3,
          x_coordinate: 0,
          y_coordinate: 1,
          description: 'There is a third room',
          exits: {
            [RoomTransition.DIRECTIONS.south]: 2,
            [RoomTransition.DIRECTIONS.west]: 4,
          },
        },
        4: {
          id: 4,
          x_coordinate: 1,
          y_coordinate: 1,
          description: 'There is the last room',
          exits: {
            [RoomTransition.DIRECTIONS.east]: 3,
            [RoomTransition.DIRECTIONS.up]: 99,
          },
        },
        99: {
          id: 99,
          x_coordinate:99,
          y_coordinate:99,
          description: 'Yay you made it to the end!',
          exits: {},
        }
      },
    });
  }

}
module.exports = MazeRoomGenerator;
