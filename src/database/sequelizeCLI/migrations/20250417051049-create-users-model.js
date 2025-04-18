'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      email: {
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
    await queryInterface.dropTable('Users');
  }
};