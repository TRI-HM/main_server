'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn('players', 'redeemAble', {
    //   type: Sequelize.TINYINT,
    //   allowNull: false,
    //   defaultValue: 0,
    // });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('players', 'redeemAble');
  }
};
