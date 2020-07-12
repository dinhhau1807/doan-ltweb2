'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Staffs',
      [
        {
          username: 'staff1',
          password:
            '$2a$10$JLCLPwf5UIObcyE3zKWVy.HM0vW7LIHL13W2R97vPL8nfdkWSpFx2',
          name: 'A2HL Staff 1',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'staff2',
          password:
            '$2a$10$pLQwvktEqC6K1JVUjMRXveHkMug9Qkkr//Ln6aMppH6NwAfLFbgYG',
          name: 'A2HL Staff 2',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'staff3',
          password:
            '$2a$10$L3aSMxxHzsJOaFNIdd9rd.8jeP7ziuQ.nftjF9cqPjo/cVT.yQJ7K',
          name: 'A2HL Staff 3',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'staff4',
          password:
            '$2a$10$WMXRmaF3NL.Xyzn4CAe2BexEf8RsojZLqdC/qxRd28wNZ39986Tpm',
          name: 'A2HL Staff 4',
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
