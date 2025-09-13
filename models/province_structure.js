'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province_structure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province_structure.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
      Province_structure.belongsTo(models.Province,{
        foreignKey: 'pro_id'
      })
      Province_structure.hasMany(models.Localite_operationnelle,{
        foreignKey: 'pstr_id'
      })
    }
  }
  Province_structure.init({
    pstr_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pro_id: DataTypes.UUID,
    str_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Province_structure',
    timestamps: false
  });
  return Province_structure;
};