'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('gifts', [
      {
        name: 'Voucher giảm giá 50.000đ',
        image_url: 'https://example.com/images/voucher-50k.jpg',
        quantity: 100,
        quantity_remaining: 100,
        description: 'Voucher giảm giá 50.000đ cho đơn hàng từ 200.000đ',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Áo thun cao cấp',
        image_url: 'https://example.com/images/tshirt.jpg',
        quantity: 50,
        quantity_remaining: 50,
        description: 'Áo thun chất lượng cao, nhiều màu sắc',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mũ bảo hiểm',
        image_url: 'https://example.com/images/helmet.jpg',
        quantity: 30,
        quantity_remaining: 30,
        description: 'Mũ bảo hiểm an toàn, đạt chuẩn',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Túi xách thời trang',
        image_url: 'https://example.com/images/bag.jpg',
        quantity: 40,
        quantity_remaining: 40,
        description: 'Túi xách đẹp, phù hợp mọi phong cách',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bình nước giữ nhiệt',
        image_url: 'https://example.com/images/bottle.jpg',
        quantity: 60,
        quantity_remaining: 60,
        description: 'Bình nước giữ nhiệt 500ml, thiết kế hiện đại',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gifts', null, {});
  }
};
