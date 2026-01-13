'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      media_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Media',
          key: 'id'
        }
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_valid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      validate_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wishes');
  }
};