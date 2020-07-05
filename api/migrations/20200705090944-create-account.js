'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      currentBalance: {
        type: Sequelize.DECIMAL
      },
      currentUnit: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      interestRate: {
        type: Sequelize.DECIMAL
      },
      term: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Accounts');
  }
};