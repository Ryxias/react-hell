'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

module.exports = (service_container, sequelize) => {
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

  Gossip.prototype.publish = function() {
    return {
      class: 'gossip',
      id: this.id,
      text: this.text,
    }
  };

  return Gossip;
};
