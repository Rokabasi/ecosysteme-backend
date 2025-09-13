'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Affectation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Affectation.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Affectation.init({
    aff_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_id: DataTypes.UUID,
    aff_direction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Affectation',
  });
  return Affectation;
};