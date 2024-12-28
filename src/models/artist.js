'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Organization, {
        foreignKey: 'org_id',
        onDelete: "CASCADE",
        as: "orgnization_details"
      });
      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        onDelete: "CASCADE",
        as: "creator_details",
      });
    }
  }
  Artist.init({
    artist_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    org_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grammy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};
