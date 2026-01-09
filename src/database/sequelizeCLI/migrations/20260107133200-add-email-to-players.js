'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('players', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('players', 'email');
  }
};
