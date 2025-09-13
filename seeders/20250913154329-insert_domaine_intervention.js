'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Domaines', [
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Droits humains',
        dom_description: 'Promotion et protection des droits humains fondamentaux'
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Santé reproductives',
        dom_description: 'Services et éducation en matière de santé reproductive'
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Lutte contre les VBG',
        dom_description: 'Prévention et réponse aux violences basées sur le genre'
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Justice sociale',
        dom_description: 'Promotion de l\'égalité et de la justice sociale'
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Éducation à la paix',
        dom_description: 'Initiatives de consolidation de la paix et de résolution des conflits'
      },
      { 
        dom_id: uuidv4(), 
        dom_designation: 'Réinsertion économique',
        dom_description: 'Programmes de réinsertion socio-économique'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Domaines', null, {});
  }
};
