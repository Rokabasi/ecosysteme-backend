'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Traitements', {
      tr_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      str_id: {
        type: Sequelize.UUID
      },
      tr_usr_id:{
        type : Sequelize.STRING
      },
      tr_usr_nom: {
        type: Sequelize.STRING
      },
      tr_usr_mail: {
        type: Sequelize.STRING
      },
      tr_usr_direction: {
        type: Sequelize.STRING
      },
      tr_usr_profil: {
        type: Sequelize.STRING
      },
      tr_usr_signature: {
        type: Sequelize.TEXT
      },
      tr_statut: {
        type: Sequelize.STRING
      },
      tr_commentaire: {
        type: Sequelize.TEXT
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
    await queryInterface.addConstraint('Traitements', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Traitements',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Traitements');
  }
};