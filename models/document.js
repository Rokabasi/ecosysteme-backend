'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Document.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Document.init({
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
    modelName: 'Document',
    timestamps:false,
  });
  return Document;
};