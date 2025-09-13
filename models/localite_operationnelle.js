'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Localite_operationnelle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Localite_operationnelle.belongsTo(models.Province_structure,{
        foreignKey: 'pstr_id'
      })
    }
  }
  Localite_operationnelle.init({
    loc_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pstr_id: DataTypes.UUID,
    loc_designation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Localite_operationnelle',
    timestamps:false,
  });
  return Localite_operationnelle;
};