'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projets', {
      pro_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      pro_code: {
        type: Sequelize.STRING
      },
      pro_intitule: {
        type: Sequelize.STRING
      },
      pro_zone: {
        type: Sequelize.STRING
      },
      pro_date_debut: {
        type: Sequelize.DATEONLY
      },
      pro_date_fin: {
        type: Sequelize.DATEONLY
      },
      pro_cout: {
        type: Sequelize.STRING
      },
      pro_resultat: {
        type: Sequelize.TEXT
      },
      pro_statut: {
        type: Sequelize.STRING
      },
      str_id: {
        type: Sequelize.UUID
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
    await queryInterface.addConstraint('Projets', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Projets',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })

    await queryInterface.addColumn('Documents', 'pro_id', {
      type: Sequelize.UUID
    })

    await queryInterface.addConstraint('Documents', {
      fields:['pro_id'],
      type:'foreign key',
      name:'pro_id_in_Documents',
      references:{
        table:"Projets",
        field:'pro_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projets');
  }
};