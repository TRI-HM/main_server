'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('check_in_players', [
      {
        id: uuidv4(),
        full_name: 'Nguyễn Văn A',
        phone: '0912345678',
        email: 'nguyenvana@example.com',
        qr_code: 'QR_PLAYER_001',
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Trần Thị B',
        phone: '0923456789',
        email: 'tranthib@example.com',
        qr_code: 'QR_PLAYER_002',
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Lê Văn C',
        phone: '0934567890',
        email: 'levanc@example.com',
        qr_code: 'QR_PLAYER_003',
        is_completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Phạm Thị D',
        phone: '0945678901',
        email: 'phamthid@example.com',
        qr_code: 'QR_PLAYER_004',
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Hoàng Văn E',
        phone: '0956789012',
        email: 'hoangvane@example.com',
        qr_code: 'QR_PLAYER_005',
        is_completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Vũ Thị F',
        phone: '0967890123',
        email: 'vuthif@example.com',
        qr_code: 'QR_PLAYER_006',
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Đỗ Văn G',
        phone: '0978901234',
        email: 'dovang@example.com',
        qr_code: 'QR_PLAYER_007',
        is_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: 'Bùi Thị H',
        phone: '0989012345',
        email: 'buithih@example.com',
        qr_code: 'QR_PLAYER_008',
        is_completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('check_in_players', null, {});
  }
};
