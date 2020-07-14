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
          notEmpty: { args: true, msg: "CustomerId must not be blank." },
        },
      },
      identityNumber: {
        type: DataTypes.STRING,
        unique: { args: true, msg: 'Identity numbers have been used.' },
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{9}$|^[0-9]{12}$/gm,
            msg: 'Identity numbers must be 9 or 12 characters in length.',
          },
        },
      },
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Registration date must not be blank." },
        },
      },
      frontImage: {
        type: DataTypes.BLOB,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Front image must not be blank." },
        },
      },
      backImage: {
        type: DataTypes.BLOB,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Back image must not be blank." },
        },
      },
      staffIdApproved: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approved: {
        type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Identity',
    }
  );
  return Identity;
};
