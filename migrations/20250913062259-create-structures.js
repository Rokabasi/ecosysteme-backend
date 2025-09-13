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
      str_designation: {
        type: Sequelize.STRING
      },
      str_sigle: {
        type: Sequelize.STRING
      },
      str_annee_creation: {
        type: Sequelize.DATEONLY
      },
      str_adresse_siege_sociale: {
        type: Sequelize.TEXT
      },
      str_nom_representant_legal: {
        type: Sequelize.STRING
      },
      str_fonction_represenatant: {
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
      str_mission: {
        type: Sequelize.TEXT
      },
      str_nombre_employe_actif: {
        type: Sequelize.INTEGER
      },
      str_resultat_operationel: {
        type: Sequelize.TEXT
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