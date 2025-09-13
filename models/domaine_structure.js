'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Domaine_structure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Domaine_structure.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
      Domaine_structure.belongsTo(models.Domaine,{
        foreignKey: 'dom_id'
      })
    }
  }
  Domaine_structure.init({
    dos_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dom_id: DataTypes.UUID,
    str_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Domaine_structure',
    timestamps:false
  });
  return Domaine_structure;
};