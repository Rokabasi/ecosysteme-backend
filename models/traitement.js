'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Traitement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Traitement.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Traitement.init({
    tr_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_id: DataTypes.UUID,
    tr_usr_id: DataTypes.STRING,
    tr_usr_nom: DataTypes.STRING,
    tr_usr_mail: DataTypes.STRING,
    tr_usr_direction: DataTypes.STRING,
    tr_usr_profil: DataTypes.STRING,
    tr_usr_signature: DataTypes.TEXT,
    tr_statut: DataTypes.STRING,
    tr_commentaire: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Traitement',
  });
  return Traitement;
};