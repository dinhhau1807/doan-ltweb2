'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Identity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Identity.belongsTo(models.Customer, {
        foreignKey: 'customerId',
      });
    }
  }
  Identity.init(
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      identityNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{9}$|^[0-9]{12}$/gm,
            msg: 'Identity number must be 9 or 12 characters in length.',
          },
        },
      },
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      frontImage: {
        type: DataTypes.BLOB,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      backImage: {
        type: DataTypes.BLOB,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      staffIdApproved: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Identity',
    }
  );
  return Identity;
};
