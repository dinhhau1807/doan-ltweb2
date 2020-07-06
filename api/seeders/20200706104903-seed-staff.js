'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Staffs',
      [
        {
          username: 'staff',
          password:
            '$2a$10$EjFeabxpdlqoYqUN1al96ORCprd25NUFpvedUw4tlEPmQMU.oGF9u',
          name: 'A2HL Staff',
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
