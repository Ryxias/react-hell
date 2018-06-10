'use strict';

const { STRING, TEXT, DATE, BIGINT, BOOLEAN } = require('sequelize');

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

  MazeGame.prototype.setData = function(data) {
    this.data = JSON.stringify(data);
  };
  MazeGame.prototype.getData = function() {
    return JSON.parse(this.data);
  };

  MazeGame.prototype.setState = function(state) {
    this.state = JSON.stringify(state);
  };
  MazeGame.prototype.getState = function() {
    return JSON.parse(this.state);
  };

  MazeGame.prototype.addLogEntry = function(entry) {
    const logs = JSON.parse(this.log) || [];
    logs.push(entry);
    this.log = JSON.stringify(logs);
  };

  return MazeGame;
};
