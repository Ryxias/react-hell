'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'rock_paper_scissors_players',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        game_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
        choice: {
          type: Sequelize.STRING(16),
          allowNull: true,
          defaultValue: null,
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
      .then(() => queryInterface.addConstraint('rock_paper_scissors_players',
        ['game_id'],
        {
          type: 'FOREIGN KEY',
          name: 'fk_rock_paper_scissors_players_games', // useful if using queryInterface.removeConstraint
          references: {
            table: 'rock_paper_scissors_games',
            field: 'id',
          },
          onDelete: 'no action',
          onUpdate: 'no action',
        }
      ))
      .then(() => queryInterface.addConstraint('rock_paper_scissors_players',
        ['user_id'],
        {
          type: 'FOREIGN KEY',
          name: 'fk_rock_paper_scissors_players_users', // useful if using queryInterface.removeConstraint
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'no action',
          onUpdate: 'no action',
        }
      ))
      .then(() => queryInterface.addIndex(
        'rock_paper_scissors_players',
        [ 'game_id', 'user_id' ],
        {
          indexName: 'rock_paper_scissors_players_game_id_user_id',
          indicesType: 'UNIQUE',
        }
      ));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rock_paper_scissors_players');
  }
};
