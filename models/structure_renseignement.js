'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Structure_renseignement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Structure_renseignement.belongsTo(models.Structure,{
        foreignKey: 'str_id'
      })
    }
  }
  Structure_renseignement.init({
    sres_id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    str_id: DataTypes.UUID,
    sres_prise_en_charge: DataTypes.BOOLEAN,
    sres_prise_en_charge_description: DataTypes.TEXT,
    sres_is_association_victime: DataTypes.BOOLEAN,
    sres_is_association_victime_description: DataTypes.TEXT,
    sres_infos_victime_sexuel: DataTypes.BOOLEAN,
    sres_pret_a_collaborer: DataTypes.BOOLEAN,
    sres_a_compte_bancaire: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Structure_renseignement',
    timestamps: false
  });
  return Structure_renseignement;
};