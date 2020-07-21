'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'DepositTerm',
      [
        {
          period: 1,
          interestRate: 4.1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 3,
          interestRate: 4.25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 6,
          interestRate: 6.6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 9,
          interestRate: 6.7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 12,
          interestRate: 6.8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 15,
          interestRate: 6.85,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 18,
          interestRate: 6.9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 21,
          interestRate: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          period: 24,
          interestRate: 7.2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('DepositTerm', null, {});
  },
};
