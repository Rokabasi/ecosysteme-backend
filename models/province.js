'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province.hasMany(models.Province_structure,{
        foreignKey: 'pro_id'
      })
    }
  }
  Province.init({
    pro_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pro_designation: DataTypes.STRING,
    pro_statut: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Province',
  });
  return Province;
};