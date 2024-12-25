'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Orginization, {
        foreignKey: 'org_id',
        onDelete: "CASCADE",
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: "CASCADE",
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    org_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
    {
      sequelize,
      modelName: 'User',
    });
  return User;
};