'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      played_1: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      played_2: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      played_3: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      played_4: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      played_5: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      played_1_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      played_2_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      played_3_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      played_4_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      played_5_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      redeem: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      redeemAble: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      tableName: 'players',
      timestamps: false,
      indexes: [
        {
          fields: ['phone'],
          unique: true,
          using: 'BTREE',
          name: 'idx_phone',
        },
        {
          fields: ['username'],
          unique: true,
          using: 'BTREE',
          name: 'idx_username',
        },
        {
          fields: ['createdAt'],
          using: 'BTREE',
          name: 'idx_createdAt',
        }
      ],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('players');
  }
};