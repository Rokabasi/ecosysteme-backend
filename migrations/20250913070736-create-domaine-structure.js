'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Domaine_structures', {
      dos_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      dom_id: {
        type: Sequelize.UUID
      },
      str_id: {
        type: Sequelize.UUID
      },
    });
    await queryInterface.addConstraint('Domaine_structures', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Domaine_structures',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
    await queryInterface.addConstraint('Domaine_structures', {
      fields:['dom_id'],
      type:'foreign key',
      name:'dom_id_in_Domaines',
      references:{
        table:"Domaines",
        field:'dom_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Domaine_structures');
  }
};