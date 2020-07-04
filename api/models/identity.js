'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Identity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Identity.belongsTo(models.Customer);
    }
  };
  Identity.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    identityNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fontImage: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    backImage: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    staffIdApproved: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Identity',
  });
  return Identity;
};