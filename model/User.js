'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

module.exports = sequelize => {
  const User = sequelize.define('user', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(255),
      allowNull: true,
    },
    email: {
      type: STRING(180),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
        len: [0, 50],
      },
    },
    auth: {
      type: STRING(180),
    },
  }, {
    tableName: 'users',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['created'] },
    ],
    hooks: {},
    instanceMethods: {},
  });

  return User;
};
