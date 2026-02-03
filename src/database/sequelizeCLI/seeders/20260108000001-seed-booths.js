'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('booths', [
      {
        booth_code: 'BOOTH001',
        booth_name: 'Gian hàng 1 - Khu vực A',
        area_code: 'AREA_A',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        booth_code: 'BOOTH002',
        booth_name: 'Gian hàng 2 - Khu vực A',
        area_code: 'AREA_A',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        booth_code: 'BOOTH003',
        booth_name: 'Gian hàng 3 - Khu vực B',
        area_code: 'AREA_B',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        booth_code: 'BOOTH004',
        booth_name: 'Gian hàng 4 - Khu vực B',
        area_code: 'AREA_B',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        booth_code: 'BOOTH005',
        booth_name: 'Gian hàng 5 - Khu vực C',
        area_code: 'AREA_C',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        booth_code: 'BOOTH006',
        booth_name: 'Gian hàng 6 - Khu vực C',
        area_code: 'AREA_C',
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('booths', null, {});
  }
};
