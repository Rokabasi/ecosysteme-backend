'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bailleur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bailleur.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Bailleur.init({
    bail_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_id: DataTypes.UUID,
    bail_nom: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Bailleur',
    timestamps:false
  });
  return Bailleur;
};