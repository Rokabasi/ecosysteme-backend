'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Structure_renseignements', {
      sres_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      str_id: {
        type: Sequelize.UUID
      },
      sres_prise_en_charge: {
        type: Sequelize.BOOLEAN
      },
      sres_prise_en_charge_description: {
        type: Sequelize.TEXT
      },
      sres_is_association_victime: {
        type: Sequelize.BOOLEAN
      },
      sres_is_association_victime_description: {
        type: Sequelize.TEXT
      },
      sres_infos_victime_sexuel: {
        type: Sequelize.BOOLEAN
      },
      sres_pret_a_collaborer: {
        type: Sequelize.BOOLEAN
      },
      sres_a_compte_bancaire: {
        type: Sequelize.BOOLEAN
      }
    });
    await queryInterface.addConstraint('Structure_renseignements', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Structure_renseignements',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Structure_renseignements');
  }
};