'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('check_in_players', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4()
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      qr_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      tableName: 'check_in_players',
      timestamps: false,
      indexes: [
        {
          fields: ['phone'],
          unique: true,
          using: 'BTREE',
          name: 'idx_phone',
        },
        {
          fields: ['created_at'],
          using: 'BTREE',
          name: 'idx_created_at',
        }
      ],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('check_in_players');
  }
};