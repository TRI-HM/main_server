'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('player_booth_progresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'check_in_players',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      booth_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'booths',
          key: 'booth_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      verified_by_account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'booth_accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('player_booth_progresses');
  }
};
