'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

/**
 * Tokens are just generic, untyped strings that can be randomly generated and persisted.
 * Tokens do not understand any logic about themselves, but other systems can utilize
 * tokens to temporarily store one-time keys or authentication-handoff stuff or whatever.
 */
module.exports = sequelize => {
  const Token = sequelize.define('token', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: STRING(64),
      allowNull: false,
    },
    context: {
      type: STRING(64),
      allowNull: false,
    },
    expires: {
      type: DATE,
      allowNull: false,
    },
    metadata: {
      type: TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'tokens',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['token'], unique: true },
      { fields: ['expires'] },
    ],
    hooks: {},
    instanceMethods: {
      // WARNING INSTANCE METHODS REMOVED IN v4!!!!
    },
    underscored: true,
  });

  return Token;
};
