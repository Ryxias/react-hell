'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

module.exports = sequelize => {

  /**
   * Some silly generic document store
   * You can store things by name and look them up later.  You can also set an expiration.
   */
  return sequelize.define('document', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(255),
      allowNull: false,
    },
    content: {
      type: TEXT,
      allowNull: false,
    },
    expiry: {
      type: DATE,
      allowNull: false,
    },
  }, {
    tableName: 'documents',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['name'], unique: true },
    ],
    hooks: {},
    instanceMethods: {},
  });
};
