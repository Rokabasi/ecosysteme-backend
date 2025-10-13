'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Province_structures', {
      pstr_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      pro_id: {
        type: Sequelize.UUID
      },
      str_id: {
        type: Sequelize.UUID
      },
      pstr_nombre_bureau:{
        type:Sequelize.INTEGER
      },
    });
    await queryInterface.addConstraint('Province_structures', {
      fields:['str_id'],
      type:'foreign key',
      name:'str_id_in_Province_structures',
      references:{
        table:"Structures",
        field:'str_id'
      }
    })
    await queryInterface.addConstraint('Province_structures', {
      fields:['pro_id'],
      type:'foreign key',
      name:'pro_id_in_Province_structures',
      references:{
        table:"Provinces",
        field:'pro_id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Province_structures');
  }
};