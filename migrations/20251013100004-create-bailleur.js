'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bailleurs', {
      bail_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      bail_nom: {
        type: Sequelize.TEXT
      },
      str_id:{
        type:Sequelize.UUID
      }
    });
    await queryInterface.addConstraint('Bailleurs', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Bailleurs',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bailleurs');
  }
};