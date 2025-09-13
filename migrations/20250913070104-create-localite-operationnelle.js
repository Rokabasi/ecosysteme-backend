'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Localite_operationnelles', {
      loc_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      pstr_id: {
        type: Sequelize.UUID
      },
      loc_designation: {
        type: Sequelize.STRING
      },
    });
    await queryInterface.addConstraint('Localite_operationnelles', {
      fields:['pstr_id'],
      type:'foreign key',
      name:'pstr_id_in_Localite_operationnelles',
      references:{
        table:"Province_structures",
        field:'pstr_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Localite_operationnelles');
  }
};