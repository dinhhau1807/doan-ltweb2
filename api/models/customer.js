'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: 'Username have been used.' },
        validate: {
          notEmpty: { args: true, msg: "Username must not be blank." },
          isAlphanumeric: { args: true, msg: "Username only accept characters and numbers." },
          notIn: {
            args: [['admin']],
            msg: 'Cant use username: admin.',
          },
          len: {
            args: [6, 12],
            msg: 'Username must be between 6 and 12 characters in length',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: 'Email have been used.' },
        validate: {
          notEmpty: { args: true, msg: "Email must not be blank." },
          len: {
            args: [6, 128],
            msg:
              'Email address must be between 6 and 128 characters in length.',
          },
          isEmail: {
						args: true,
            msg: 'Email address is invalid.',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Password must not be blank." },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Name must not be blank." },
          len: {
            args: [3, 50],
            msg: 'Name must be between 3 and 50 characters in length.',
          },
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "DOB must not be blank." },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Phone numbers must not be blank." },
          isNumeric: { args: true, msg: "Phone numbers only accept numbers." },
          is: {
            args: /(03|05|07|08|09|[2|6|8|9])+([0-9]{8})\b/,
            msg: 'Phone numbers is invalid.',
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "Address must not be blank." },
        },
      },
      verifyCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'inactive',
      },
    },
    {
      sequelize,
      modelName: 'Customer',
    }
  );
  return Customer;
};
