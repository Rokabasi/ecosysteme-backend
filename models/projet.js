'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Projet.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
      Projet.hasMany(models.Document,{
        foreignKey: 'pro_id'
      })

    }
  }
  Projet.init({
    pro_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pro_code: DataTypes.STRING,
    pro_intitule: DataTypes.STRING,
    pro_zone: DataTypes.STRING,
    pro_date_debut: DataTypes.DATEONLY,
    pro_date_fin: DataTypes.DATEONLY,
    pro_cout: DataTypes.STRING,
    pro_resultat: DataTypes.TEXT,
    pro_statut: DataTypes.STRING,
    str_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Projet',
  });
  return Projet;
};