'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UsersModel', {
      id: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      mail: {
        type: Sequelize.STRING(100),
      },
      gift: {
        type: Sequelize.STRING(255),
      },
      note: {
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE(),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE(),
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UsersModel');
  }
};