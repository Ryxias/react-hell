'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

/**
 * A SlackUser is a row that extends the User object with information about their
 * associated Slack account. It enables seamless integration between the website
 * and slack by connecting the two identities.
 */
module.exports = sequelize => {
  const SlackUser = sequelize.define('slack_user', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: BIGINT.UNSIGNED,
      allowNull: false,
    },
    slack_user_id: {
      type: STRING(255),
      allowNull: true,
    },
    slack_channel_id: {
      type: STRING(180),
      allowNull: true,
    },
  }, {
    tableName: 'slack_users',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['user_id'], unique: true },
      { fields: ['slack_user_id'] },
      { fields: ['slack_channel_id'] },
    ],
    hooks: {},
    instanceMethods: {
      // WARNING INSTANCE METHODS REMOVED IN v4!!!!
    },
    underscored: true,
  });


  return SlackUser;
};
