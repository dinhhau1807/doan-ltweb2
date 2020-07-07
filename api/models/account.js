'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.Customer, {
        foreignKey: 'customerId',
      });
    }
  }
  Account.init(
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currentBalance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      currentUnit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      interestRate: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      term: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Account',
    }
  );
  return Account;
};
