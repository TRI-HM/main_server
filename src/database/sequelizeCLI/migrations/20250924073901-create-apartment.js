'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('real_estate_apartments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_staff: {
        type: Sequelize.STRING,
        references: {
          model: 'real_estate_staffs',
          key: 'id'
        },
        onUpdate: 'CASCADE', // Khi update id trong staffs
        onDelete: 'RESTRICT' // Không cho phép xóa staff nếu có apartment
      },
      block: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      floor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apartment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('real_estate_apartments');
  }
};