'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transfer.belongsTo(models.Bank, {
        foreignKey: 'sourceBankId',
      });
      Transfer.belongsTo(models.Bank, {
        foreignKey: 'destinationBankId',
      });
    }
  }
  Transfer.init(
    {
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sourceBankId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destinationBankId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destinationAccount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Transfer',
    }
  );
  return Transfer;
};
