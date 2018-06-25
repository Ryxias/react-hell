'use strict';

const { STRING, TEXT, DATE, BIGINT, BOOLEAN } = require('sequelize');

/**
 * The reason this is created is to prevent
 */
module.exports = (service_container, sequelize) => {
  const RockPaperScissorsPlayer = sequelize.define('rock_paper_scissors_player', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Foreign key to RockPaperScissorsGames.id
     */
    game_id: {
      type: BIGINT.UNSIGNED,
      allowNull: false,
    },

    /**
     * Foreign key to User.id
     */
    user_id: {
      type: BIGINT.UNSIGNED,
      allowNull: false,
    },

    choice: {
      type: TEXT(16),
      allowNull: true,
      defaultValue: null,
    },

  }, {
    tableName: 'rock_paper_scissors_players',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['game_id', 'user_id'], unique: true },
    ],
    hooks: {},
    instanceMethods: {
      // WARNING INSTANCE METHODS REMOVED IN v4!!!!
    },
  });

  return RockPaperScissorsPlayer;
};
