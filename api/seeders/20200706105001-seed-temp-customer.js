'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Customers',
      [
        {
          username: 'democust',
          email: 'democust@example.com',
          password:
            '$2a$10$QeUFOtaYs656SR/vxR9EP.RH0Kqy1NySd1W3rhxHCmZLbnKARWZVy',
          name: 'demo',
          dateOfBirth: new Date(),
          phoneNumber: '0909123456',
          address: '1234',
          verifyCode: '1234',
          status: 'inactive',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Customers', null, {});
  },
};
