'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = sequelize => {
  const Gossip = sequelize.define('gossip', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'gossip',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['created'] },
    ],
    hooks: {},
    instanceMethods: {
      // WARNING INSTANCE METHODS REMOVED IN v4!!!!
    },
  });


  return Gossip;
};
