'use strict';

const { STRING, TEXT, DATE, BIGINT, BOOLEAN } = require('sequelize');

module.exports = sequelize => {
  const HangmanGame = sequelize.define('hangman_game', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: STRING(100),
      allowNull: false,
    },
    phrase: {
      type: STRING(255),
      allowNull: true,
    },
    guesses: {
      type: TEXT('small'),
      allowNull: false,
    },
    active: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'hangman_games',
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

  return HangmanGame;
};
