'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Structure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Structure.hasMany(models.Province_structure,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Domaine_structure,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Structure_renseignement,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Document,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Affectation,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Traitement,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Partenaire,{
        foreignKey: 'str_id'
      })
      Structure.hasMany(models.Projet,{
        foreignKey: 'str_id'
      })
    }
  }
  Structure.init({
    str_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_code: {
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    str_designation: DataTypes.STRING,
    str_sigle: DataTypes.STRING,
    str_annee_creation: DataTypes.STRING,
    str_adresse_siege_sociale: DataTypes.TEXT,
    str_province_siege_sociale: DataTypes.TEXT,
    str_nom_representant_legal: DataTypes.STRING,
    str_fonction_representant: DataTypes.STRING,
    str_telephone: DataTypes.STRING,
    str_email: DataTypes.STRING,
    str_site_web: DataTypes.STRING,
    str_mission: DataTypes.TEXT,
    str_nombre_employe_actif: DataTypes.INTEGER,
    str_resultat_operationel: DataTypes.TEXT,
    str_niveau_risque: DataTypes.STRING,
    str_statut: DataTypes.STRING,
    str_statut_verification: DataTypes.STRING,
    str_is_reset: DataTypes.BOOLEAN,
    str_is_affected: DataTypes.BOOLEAN,
    str_nombre_victime: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Structure',
  });
  return Structure;
};