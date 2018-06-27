'use strict';

const { STRING, TEXT, DATE, BIGINT, BOOLEAN } = require('sequelize');

module.exports = (service_container, sequelize) => {
  const RockPaperScissorsGame = sequelize.define('rock_paper_scissors_game', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: STRING(100),
      allowNull: false,
    },

    /**
     * Datetime at which the game is over and the winner is counted
     */
    game_ends_at: {
      type: DATE,
      allowNull: false,
    },

    /**
     * 1 if the game is playing. 0 if the game is done.
     */
    active: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'rock_paper_scissors_games',
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

  RockPaperScissorsGame.prototype.start = function(player) {

  };

  RockPaperScissorsGame.prototype.join = function(player) {

  };

  RockPaperScissorsGame.prototype.pick = function(player, choice) {

  };

  return RockPaperScissorsGame;
};
