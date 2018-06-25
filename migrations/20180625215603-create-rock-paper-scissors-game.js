'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'rock_paper_scissors_games',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        game_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        game_ends_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        created: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        modified: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    )
      .then(() => queryInterface.addIndex(
        'rock_paper_scissors_games',
        [ 'game_id' ],
        {
          indexName: 'rock_paper_scissors_games_game_id',
        }
      ));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rock_paper_scissors_games');
  }
};
