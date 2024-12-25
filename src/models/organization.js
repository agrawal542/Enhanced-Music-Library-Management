'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orginization.hasMany(models.User, {
        foreignKey: 'org_id', // Matches the foreign key in the Airport model
        onDelete: "CASCADE", // Deletes airports when a city is deleted
      });
    }
  }
  Organization.init({
    org_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Organization',
  });
  return Organization;
};