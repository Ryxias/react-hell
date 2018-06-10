'use strict';

const { STRING, TEXT, DATE, BIGINT, BOOLEAN } = require('sequelize');

const MazeGameData = require('../lib/Maze/MazeGameData');
const MazeGameState = require('../lib/Maze/MazeGameState');

module.exports = (service_container, sequelize) => {
  const MazeGame = sequelize.define('maze_game', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: STRING(100),
      allowNull: false,
    },
    random_seed: {
      type: STRING(100),
      allowNull: false,
    },
    data: {
      type: TEXT('long'),
      allowNull: false,
    },
    state: {
      type: TEXT('long'),
      allowNull: false,
    },
    log: {
      type: TEXT('long'),
      allowNull: false,
    },
  }, {
    tableName: 'maze_games',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['game_id'] },
    ],
    hooks: {},
    instanceMethods: {
      // WARNING INSTANCE METHODS REMOVED IN v4!!!!
    },
  });

  MazeGame.prototype.setData = function(maze_game_data) {
    if (!maze_game_data instanceof MazeGameData) {
      throw new Error('Invalid MazeGameData');
    }
    this.data = maze_game_data.toDb();
  };
  MazeGame.prototype.getData = function() {
    return MazeGameData.fromDb(this.data);
  };

  MazeGame.prototype.setState = function(maze_game_state) {
    if (!maze_game_state instanceof MazeGameState) {
      throw new Error('Invalid MazeGameState');
    }
    this.state = maze_game_state.toDb();
  };
  MazeGame.prototype.getState = function() {
    return MazeGameState.fromDb(this.state);
  };

  MazeGame.prototype.addLogEntry = function(entry) {
    const logs = JSON.parse(this.log) || [];
    logs.push(entry);
    this.log = JSON.stringify(logs);
  };

  return MazeGame;
};
