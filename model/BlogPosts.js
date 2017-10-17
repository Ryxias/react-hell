'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('blogpost', {
    tableName: 'blogposts',
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: STRING(255),
      allowNull: false,
    },
    title: {
      type: STRING(255),
      allowNull: false,
    },
    body: {
      type: TEXT('medium'),
      allowNull: false,
    },
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['created'] },
    ],
  });
};
