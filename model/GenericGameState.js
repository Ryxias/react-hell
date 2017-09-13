'use strict';

const { STRING, TEXT, BIGINT } = require('sequelize');

module.exports = sequelize => {

  /**
   * Some silly generic document store
   */
  const GenericGameState = sequelize.define('generic_game_state', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(255),
      allowNull: false,
    },
    state: {
      type: TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'generic_game_states',
    indexes: [
      { fields: ['name'] },
    ],
    hooks: {},
    instanceMethods: {},
  });

  return GenericGameState;
};
