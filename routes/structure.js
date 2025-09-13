const express = require("express");
const router = express.Router();
const { Structure, Province_structure, Localite_operationnelle, Domaine_structure } = require("../models");
const { Op } = require('sequelize');

// GET all structures
router.get("/", async function (req, res, next) {
  try {
    const structures = await Structure.findAll();
    return res.status(200).json(structures);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST register a new structure
router.post("/register", async function (req, res, next) {
  const transaction = await Structure.sequelize.transaction();
  
  try {
    const {
      // Structure data
      str_designation,
      str_sigle,
      str_annee_creation,
      str_adresse_siege_sociale,
      str_nom_representant_legal,
      str_fonction_representant,
      str_telephone,
      str_email,
      str_site_web,
      str_mission,
      str_nombre_employe_actif,
      str_resultat_operationel,
      
      // Related data
      provinces = [], // Array of province IDs
      localites = [], // Array of { pstr_id, designation } objects
      domaines = []   // Array of domain IDs
    } = req.body;

    // Check for duplicate structure
    const existingStructure = await Structure.findOne({
      where: {
            str_designation,
            str_sigle,
            str_annee_creation
      },
      transaction
    });

    if (existingStructure) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Une structure avec cette désignation ou ce sigle et année existe déjà"
      });
    }

    // Create the structure
    const structure = await Structure.create({
      str_designation,
      str_sigle,
      str_annee_creation,
      str_adresse_siege_sociale,
      str_nom_representant_legal,
      str_fonction_representant,
      str_telephone,
      str_email,
      str_site_web,
      str_mission,
      str_nombre_employe_actif,
      str_resultat_operationel,
      str_statut: 'soumis',
      str_statut_verification: 'soumis',
    }, { transaction });

    // Create province_structure relationships
    const provinceStructures = await Promise.all(
      provinces.map(pro_id => 
        Province_structure.create({
          pro_id,
          str_id: structure.str_id
        }, { transaction })
      )
    );

    // Create localite_operationnelle entries
     await Promise.all(
      localites.map(async (localite) => {
        // Find the corresponding province_structure
        const provinceStructure = provinceStructures.find(
          ps => ps.pro_id === localite.provinceId
        );
        
        if (provinceStructure) {
          return Localite_operationnelle.create({
            pstr_id: provinceStructure.pstr_id,
            loc_designation: localite.designation
          }, { transaction });
        }
        return null;
      }).filter(Boolean)
    );

    // Create domaine_structure relationships
    await Promise.all(
      domaines.map(dom_id => 
        Domaine_structure.create({
          dom_id,
          str_id: structure.str_id
        }, { transaction })
      )
    );

    await transaction.commit();
    
    // Return the created structure with its relationships
    const result = await Structure.findByPk(structure.str_id, {
      include: [
        { model: Province_structure, include: [Localite_operationnelle] },
        { model: Domaine_structure }
      ],
      transaction
    });

    return res.status(201).json(result);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating structure:', error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la création de la structure",
      error: error.message
    });
  }
});

module.exports = router;
