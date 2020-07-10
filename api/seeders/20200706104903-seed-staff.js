'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Staffs',
      [
        {
          username: 'staff',
          password:
            '$2a$10$QeUFOtaYs656SR/vxR9EP.RH0Kqy1NySd1W3rhxHCmZLbnKARWZVy',
          name: 'A2HL Staff',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'staff1',
          password:
            '$2a$10$QeUFOtaYs656SR/vxR9EP.RH0Kqy1NySd1W3rhxHCmZLbnKARWZVy',
          name: 'A2HL Staff1',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'staff2',
          password:
            '$2a$10$QeUFOtaYs656SR/vxR9EP.RH0Kqy1NySd1W3rhxHCmZLbnKARWZVy',
          name: 'A2HL Staff2',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'staff3',
          password:
            '$2a$10$QeUFOtaYs656SR/vxR9EP.RH0Kqy1NySd1W3rhxHCmZLbnKARWZVy',
          name: 'A2HL Staff3',
          roleId: 2,
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
