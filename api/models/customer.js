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
				unique: true,
				validate: {
					notEmpty: true,
					isAlphanumeric: true, //Only number + character
					notIn: {
						args: [['admin']],
						msg: "Cant use username: admin"
					},
					len: {
						args: [6, 12],
						msg: "Username must be between 6 and 12 characters in length"
					},
				},
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
				unique: true,
				validate: {
					notEmpty: true,
					len: {
						args: [6, 128],
						msg: "Email address must be between 6 and 128 characters in length"
					},
					isEmail: {
							msg: "Email address must be valid"
					} 
				},
      },
      password: {
        type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
      },
      name: {
        type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: {
						args: [3, 50],
						msg: "Name must be between 3 and 50 characters in length"
					},
				},
      },
      dateOfBirth: {
        type: DataTypes.DATE,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
      },
      phoneNumber: {
        type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					isNumeric: true,
					is: {
						args: /(03|05|07|08|09|[2|6|8|9])+([0-9]{8})\b/,
						msg: "Phone number invalid"
					},
				},
      },
      address: {
        type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
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
