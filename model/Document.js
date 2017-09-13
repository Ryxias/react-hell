'use strict';

const { STRING, TEXT, DATE } = require('sequelize');

module.exports = sequelize => {

  /**
   * Some silly generic document store
   * You can store things by name and look them up later.  You can also set an expiration.
   */
  return sequelize.define('document', {
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
    }
  }, {
    tableName: 'documents',
    indexes: [
      { fields: ['name'] },
    ],
    hooks: {},
    instanceMethods: {},
  });
};
