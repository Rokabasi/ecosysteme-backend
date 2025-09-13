'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Domaines', {
      dom_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      dom_designation: {
        type: Sequelize.STRING
      },
      dom_description: {
        type: Sequelize.TEXT
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Domaines');
  }
};