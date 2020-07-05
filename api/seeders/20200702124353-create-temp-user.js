'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Customers',
      [
        {
          username: 'demo',
          email: 'demo@example.com',
          password:
            '$2a$10$EjFeabxpdlqoYqUN1al96ORCprd25NUFpvedUw4tlEPmQMU.oGF9u',
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
