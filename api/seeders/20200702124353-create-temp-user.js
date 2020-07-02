'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Customers',
      [
        {
          username: 'demo',
          email: 'demo@example.com',
          password: '1234demo',
          name: 'demo',
          dateOfBirth: new Date(),
          phoneNumber: '1234',
          address: '1234',
          verifyCode: '1234',
          status: true,
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
