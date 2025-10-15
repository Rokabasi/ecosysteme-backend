'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Structures', {
      str_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      str_code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      str_designation: {
        type: Sequelize.STRING
      },
      str_sigle: {
        type: Sequelize.STRING
      },
      str_annee_creation: {
        type: Sequelize.STRING
      },
      str_province_siege_sociale:{
        type: Sequelize.STRING
      },
      str_adresse_siege_sociale: {
        type: Sequelize.TEXT
      },
      str_nom_representant_legal: {
        type: Sequelize.STRING
      },
      str_fonction_representant: {
        type: Sequelize.STRING
      },
      str_telephone: {
        type: Sequelize.STRING
      },
      str_email: {
        type: Sequelize.STRING
      },
      str_site_web: {
        type: Sequelize.STRING
      },
      str_nombre_employe_actif: {
        type: Sequelize.INTEGER
      },
      str_nombre_volontaire:{
        type: Sequelize.INTEGER
      },
      str_resultat_operationel: {
        type: Sequelize.TEXT
      },
      str_moyen_logistique: {
        type: Sequelize.TEXT
      },
      str_systeme_suivi_evaluation: {
        type: Sequelize.TEXT
      },
      str_domaine_activite: {
        type: Sequelize.STRING
      },
      str_niveau_risque: {
        type: Sequelize.STRING
      },
      str_statut: {
        type: Sequelize.STRING
      },
      str_statut_verification: {
        type: Sequelize.STRING
      },
      str_is_reset: {
        type: Sequelize.BOOLEAN
      },
      str_is_affected: {
        type: Sequelize.BOOLEAN
      },
      str_somme_recu_annee_N_en_dollars:{
        type: Sequelize.FLOAT
      },
      str_somme_recu_annee_N1_en_dollars:{
        type: Sequelize.FLOAT
      },
      str_somme_recu_annee_N2_en_dollars:{
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Structures');
  }
};