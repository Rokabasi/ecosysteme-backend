'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Documents', {
      doc_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      str_id: {
        type: Sequelize.UUID
      },
      doc_path: {
        type: Sequelize.TEXT
      },
      doc_name: {
        type: Sequelize.STRING
      },
      doc_designation: {
        type: Sequelize.STRING
      },
      doc_size:{
        type: Sequelize.STRING
      }
    });
    await queryInterface.addConstraint('Documents', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Documents',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Documents');
  }
};