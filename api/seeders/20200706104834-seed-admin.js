'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Staffs',
      [
        {
          username: 'admin',
          password:
            '$2a$10$QeUFOtaYs656SR/vxR9EP.RH0Kqy1NySd1W3rhxHCmZLbnKARWZVy',
          name: 'A2HL Admin',
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Staffs', null, {});
  },
};
