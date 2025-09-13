const express = require("express");
const router = express.Router();
const { 
  Structure, 
  Province_structure, 
  Localite_operationnelle, 
  Domaine_structure,
  Structure_renseignement,
  Document
} = require("../models");
const { Op } = require('sequelize');
const upload = require("../utils/multer");

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
router.post("/register", upload.array("files", 20), async function (req, res, next) {
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
      sres_prise_en_charge,
      sres_prise_en_charge_description,
      sres_is_association_victime,
      sres_is_association_victime_description,
      sres_infos_victime_sexuel,
      sres_pret_a_collaborer,
      sres_a_compte_bancaire,

      doc_designation,

      
      // Related data
      provinces = [], // Array of province IDs
      localites = [], // Array of { pro_id, designation } objects
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
          ps => ps.pro_id === localite.pro_id
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

    // Create Structure_renseignement with default values
    await Structure_renseignement.create({
      str_id: structure.str_id,
      sres_prise_en_charge,
      sres_prise_en_charge_description,
      sres_is_association_victime,
      sres_is_association_victime_description,
      sres_infos_victime_sexuel,
      sres_pret_a_collaborer,
      sres_a_compte_bancaire
    }, { transaction });

    // Define document types and their corresponding field names from the form
    const documentTypes = [
      { field: 'doc_arrete_creation', designation: 'Arrêté de création' },
      { field: 'doc_arrete_approbation', designation: 'Arrêté portant approbation des statuts' },
      { field: 'doc_statut', designation: 'Statuts' },
      { field: 'doc_reglement_interieur', designation: 'Règlement intérieur' },
      { field: 'doc_preuve_agrement', designation: 'Preuve d\'agrément' },
      { field: 'doc_rapport_annuel', designation: 'Rapport d\'activités de l\'année précédente' },
      { field: 'doc_plan_action', designation: 'Plan d\'action de l\'année en cours' },
      { field: 'doc_rapport_financier', designation: 'Rapport financier de l\'année précédente' },
      { field: 'doc_budget', designation: 'Budget de l\'année en cours' },
      { field: 'doc_rapport_audit', designation: 'Rapport d\'audit des comptes annuels' },
      { field: 'doc_rapport_commissaire', designation: 'Rapport du commissaire aux comptes' },
      { field: 'doc_rapport_orientation', designation: 'Rapport d\'orientation' },
      { field: 'doc_rapport_morale', designation: 'Rapport moral' }
    ];

    let documents = [];

    if (req.files && req.files.length > 0) {
      // Process each uploaded file
      for (const file of req.files) {
        // Find the document type based on the fieldname
        const docType = documentTypes.find(type => file.fieldname.includes(type.field));
        
        if (docType) {
          documents.push({
            doc_name: file.filename,
            doc_path: file.path,
            doc_size: file.size,
            doc_designation: docType.designation,
            str_id: structure.str_id,
          });
        }
      }

      if (documents.length > 0) {
        await Document.bulkCreate(documents, {
          transaction,
          returning: true,
        });
      }
    }

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
