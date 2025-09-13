'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Documents.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Documents.init({
    doc_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_id: DataTypes.UUID,
    doc_path: DataTypes.TEXT,
    doc_name: DataTypes.STRING,
    doc_size:DataTypes.STRING,
    doc_designation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Documents',
    timestamps:false,
  });
  return Documents;
};