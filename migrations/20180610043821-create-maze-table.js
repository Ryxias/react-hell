'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'maze_games',
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
        random_seed: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        data: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        state: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        log: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
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
        'maze_games',
        [ 'game_id' ],
        {
          indexName: 'maze_games_game_id',
        }
      ))
      ;
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('maze_games');
  }
};
