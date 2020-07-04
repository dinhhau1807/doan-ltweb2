'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountSourceId: {
        type: Sequelize.INTEGER
      },
      accountDestination: {
        type: Sequelize.INTEGER
      },
      bankIdDestination: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      otpCode: {
        type: Sequelize.STRING
      },
      otpCreatedDate: {
        type: Sequelize.DATE
      },
      otpExpiredDate: {
        type: Sequelize.DATE
      },
      createdDate: {
        type: Sequelize.DATE
      },
      updated: {
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
    await queryInterface.dropTable('Transactions');
  }
};