'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Account);
      Transaction.belongsTo(models.Bank);
    }
  };
  Transaction.init({
    accountSourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountDestination: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bankIdDestination: {
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};