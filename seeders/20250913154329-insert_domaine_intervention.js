'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import('uuid');
    await queryInterface.bulkInsert('Domaines', [
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Santé (médical / psychosocial)',
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Éducation / formation',
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Réinsertion socio-économique / moyens de subsistance',
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Accompagnement judiciaire',
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Genre et droits humains',
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Mémoire et commémoration',
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Domaines', null, {});
  }
};
