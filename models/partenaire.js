'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partenaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Partenaire.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Partenaire.init({
    part_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_id: DataTypes.UUID,
    part_statut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Partenaire',
  });
  return Partenaire;
};