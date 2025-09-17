'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Partenaires', {
      part_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      str_id: {
        type: Sequelize.UUID
      },
      part_statut: {
        type: Sequelize.STRING
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
    await queryInterface.addConstraint('Partenaires', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Partenaires',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Partenaires');
  }
};