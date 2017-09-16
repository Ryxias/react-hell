'use strict';

const { STRING, BIGINT } = require('sequelize');

module.exports = sequelize => {
  /**
   *
   */
  return sequelize.define('slack_message', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    channel: {
      type: STRING(255),
      allowNull: false,
    },
    user: {
      type: STRING(255),
      allowNull: false,
    },
    type: {
      type: STRING(255),
      allowNull: false,
    },
    text: {
      type: STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'slack_messages',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['text', 'created'], unique: true },
      { fields: ['user', 'created'], unique: true },
    ],
    hooks: {},
    instanceMethods: {},
  });
};

