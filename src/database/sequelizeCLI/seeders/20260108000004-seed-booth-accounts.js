'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password mặc định: 'password123'
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('booth_accounts', [
      {
        username: 'admin_booth001',
        password: hashedPassword,
        booth_code: 'BOOTH001',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'staff_booth001',
        password: hashedPassword,
        booth_code: 'BOOTH001',
        role: 'staff',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager_booth002',
        password: hashedPassword,
        booth_code: 'BOOTH002',
        role: 'manager',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'staff_booth002',
        password: hashedPassword,
        booth_code: 'BOOTH002',
        role: 'staff',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'admin_booth003',
        password: hashedPassword,
        booth_code: 'BOOTH003',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'staff_booth003',
        password: hashedPassword,
        booth_code: 'BOOTH003',
        role: 'staff',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'staff_booth004',
        password: hashedPassword,
        booth_code: 'BOOTH004',
        role: 'staff',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager_booth005',
        password: hashedPassword,
        booth_code: 'BOOTH005',
        role: 'manager',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('booth_accounts', null, {});
  }
};
