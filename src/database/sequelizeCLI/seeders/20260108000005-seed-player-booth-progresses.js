'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách players và booth accounts để tạo progress
    const [players] = await queryInterface.sequelize.query(
      "SELECT id FROM check_in_players ORDER BY created_at LIMIT 8"
    );
    
    const [boothAccounts] = await queryInterface.sequelize.query(
      "SELECT id, booth_code FROM booth_accounts ORDER BY id"
    );

    const [booths] = await queryInterface.sequelize.query(
      "SELECT booth_code FROM booths ORDER BY booth_code"
    );

    const progresses = [];
    const now = new Date();

    // Tạo progress cho một số players đã check-in tại các booth
    if (players.length > 0 && boothAccounts.length > 0) {
      // Player 1 check-in tại BOOTH001
      if (players[0] && boothAccounts[0]) {
        progresses.push({
          player_id: players[0].id,
          booth_code: boothAccounts[0].booth_code,
          verified_by_account_id: boothAccounts[0].id,
          verified_at: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 giờ trước
          created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        });
      }

      // Player 2 check-in tại BOOTH001
      if (players[1] && boothAccounts[0]) {
        progresses.push({
          player_id: players[1].id,
          booth_code: boothAccounts[0].booth_code,
          verified_by_account_id: boothAccounts[0].id,
          verified_at: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 giờ trước
          created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        });
      }

      // Player 3 check-in tại BOOTH002
      if (players[2] && boothAccounts[2]) {
        progresses.push({
          player_id: players[2].id,
          booth_code: boothAccounts[2].booth_code,
          verified_by_account_id: boothAccounts[2].id,
          verified_at: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 giờ trước
          created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        });
      }

      // Player 3 check-in tại BOOTH003 (đã check-in nhiều booth)
      if (players[2] && boothAccounts[4]) {
        progresses.push({
          player_id: players[2].id,
          booth_code: boothAccounts[4].booth_code,
          verified_by_account_id: boothAccounts[4].id,
          verified_at: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 giờ trước
          created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        });
      }

      // Player 4 check-in tại BOOTH002
      if (players[3] && boothAccounts[2]) {
        progresses.push({
          player_id: players[3].id,
          booth_code: boothAccounts[2].booth_code,
          verified_by_account_id: boothAccounts[2].id,
          verified_at: new Date(now.getTime() - 30 * 60 * 1000), // 30 phút trước
          created_at: new Date(now.getTime() - 30 * 60 * 1000),
          updated_at: new Date(now.getTime() - 30 * 60 * 1000),
        });
      }

      // Player 5 check-in tại BOOTH003
      if (players[4] && boothAccounts[4]) {
        progresses.push({
          player_id: players[4].id,
          booth_code: boothAccounts[4].booth_code,
          verified_by_account_id: boothAccounts[4].id,
          verified_at: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 giờ trước
          created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        });
      }

      // Player 5 check-in tại BOOTH004 (đã check-in nhiều booth)
      if (players[4] && boothAccounts[6]) {
        progresses.push({
          player_id: players[4].id,
          booth_code: boothAccounts[6].booth_code,
          verified_by_account_id: boothAccounts[6].id,
          verified_at: new Date(now.getTime() - 45 * 60 * 1000), // 45 phút trước
          created_at: new Date(now.getTime() - 45 * 60 * 1000),
          updated_at: new Date(now.getTime() - 45 * 60 * 1000),
        });
      }

      // Player 7 check-in tại BOOTH001
      if (players[6] && boothAccounts[0]) {
        progresses.push({
          player_id: players[6].id,
          booth_code: boothAccounts[0].booth_code,
          verified_by_account_id: boothAccounts[0].id,
          verified_at: new Date(now.getTime() - 15 * 60 * 1000), // 15 phút trước
          created_at: new Date(now.getTime() - 15 * 60 * 1000),
          updated_at: new Date(now.getTime() - 15 * 60 * 1000),
        });
      }

      // Player 8 check-in tại BOOTH005
      if (players[7] && boothAccounts[7]) {
        progresses.push({
          player_id: players[7].id,
          booth_code: boothAccounts[7].booth_code,
          verified_by_account_id: boothAccounts[7].id,
          verified_at: new Date(now.getTime() - 20 * 60 * 1000), // 20 phút trước
          created_at: new Date(now.getTime() - 20 * 60 * 1000),
          updated_at: new Date(now.getTime() - 20 * 60 * 1000),
        });
      }
    }

    if (progresses.length > 0) {
      await queryInterface.bulkInsert('player_booth_progresses', progresses, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_booth_progresses', null, {});
  }
};
