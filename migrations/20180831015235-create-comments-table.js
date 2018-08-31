'use strict';

/**
 * Don't worry too much about the syntax of this file. There's a big learning curve and I can
 * do a video call to explain each line in more detail.
 *
 * The GIST of this file? We use Sequelize to communicate with the Database. Sequelize uses this file to
 * setup our new "comments" table ON THE DATABASE.
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'comments',
      {
        id: {
          type: BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: STRING(255),
          allowNull: true,
        },
        text: {
          type: STRING(255),
          allowNull: true,
        },

        created: Sequelize.DATE,
        modified: Sequelize.DATE,
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comments');
  }
};
