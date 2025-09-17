'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import('uuid');
    await queryInterface.bulkInsert('Provinces', [
      { pro_id: uuidv4(), pro_designation: 'Bas-Uele', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Équateur', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Haut-Katanga', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Haut-Lomami', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Haut-Uele', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Ituri', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kasaï', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kasaï-Central', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kasaï-Oriental', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kinshasa', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kongo-Central', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kwango', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Kwilu', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Lomami', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Lualaba', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Maï-Ndombe', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Maniema', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Mongala', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Nord-Kivu', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Nord-Ubangi', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Sankuru', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Sud-Kivu', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Sud-Ubangi', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Tanganyika', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Tshopo', pro_statut: true },
      { pro_id: uuidv4(), pro_designation: 'Tshuapa', pro_statut: true }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Provinces', null, {});
  }
};
