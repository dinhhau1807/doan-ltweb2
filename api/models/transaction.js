'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Account, {
        foreignKey: 'accountSourceId',
      });
      Transaction.belongsTo(models.Bank, {
        foreignKey: 'bankDestinationId',
      });
    }
  }
  Transaction.init(
    {
      accountSourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountDestination: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bankDestinationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      otpCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otpCreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      otpExpiredDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
