const express = require("express");
const router = express.Router();
const {
  Structure,
  Province_structure,
  Localite_operationnelle,
  Domaine_structure,
  Structure_renseignement,
  Document,
} = require("../models");
const upload = require("../utils/multer");
const auth = require("../middleware/auth");

// POST register a new structure
router.post(
  "/",
  upload.any(),
  async function (req, res, next) {
    const structureData = JSON.parse(req.body.structure);
    
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
        str_province_siege_sociale,
        // Related data
        provinces = [], // Array of province IDs
        localites = [], // Array of { pro_id, localite: [items] } objects
        domaines = [], // Array of domain IDs
      } = structureData;

      // Check for duplicate structure
      const existingStructure = await Structure.findOne({
        where: {
          str_designation,
          str_annee_creation,
          str_province_siege_sociale
        }
      });

      if (existingStructure) {
        return res.status(409).json({
          message:
            "Une structure ayant les meme données d'identification existe déjà dans le système",
        });
      }

      // Create the structure
      const structure = await Structure.create({
        str_designation,
        str_sigle: str_sigle || null,
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
        str_province_siege_sociale,
        str_statut: "soumis",
        str_statut_verification: "en cours de traitement",
      });

      // Create province_structure relationships
      const provinceStructures = await Promise.all(
        provinces.map((pro_id) =>
          Province_structure.create({
            pro_id,
            str_id: structure.str_id,
          })
        )
      );

      // Create localite_operationnelle entries
      await Promise.all(
        localites
          .map((provinceItem) => {
            // Find the corresponding province_structure
            const provinceStructure = provinceStructures.find(
              (ps) => ps.pro_id === provinceItem.pro_id
            );

            if (provinceStructure && Array.isArray(provinceItem.localite)) {
              return Promise.all(
                provinceItem.localite.map((localite) =>
                  Localite_operationnelle.create({
                    pstr_id: provinceStructure.pstr_id,
                    loc_designation: localite,
                  })
                )
              );
            }
            return null;
          })
          .filter(Boolean)
      ).then((results) => results.flat());

      // Create domaine_structure relationships
      await Promise.all(
        domaines.map((dom_id) =>
          Domaine_structure.create({
            dom_id,
            str_id: structure.str_id,
          })
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
        sres_a_compte_bancaire,
      });

      // Map frontend field names to document designations
      const documentFieldMap = {
        statutNotarie: "Statuts notariés de l'ASBL/ONG",
        regledordreinterieur: "Règlement d'ordre intérieurs",
        personnalitejuridique: "Personnalité juridique",
        organigramme: "Organigramme",
        rapport1: "Rapport d'activités 1",
        rapport2: "Rapport d'activités 2",
        rapport3: "Rapport d'activités 3",
        etatfin1: "États financiers 1",
        etatfin2: "États financiers 2",
        etatfin3: "États financiers 3",
        dernierpv:
          "Dernier procès-verbal d'assemblée générale/Conseil d'Administration",
      };

      let documents = [];

      if (req.files && req.files.length > 0) {
        // Process each uploaded file
        for (const file of req.files) {
          const fieldName = file.fieldname;
          const docDesignation = documentFieldMap[fieldName] || fieldName; // Use field name as fallback

          documents.push({
            doc_name: file.filename,
            doc_path: file.path,
            doc_size: file.size,
            doc_designation: docDesignation,
            str_id: structure.str_id,
          });
        }

        if (documents.length > 0) {
          await Document.bulkCreate(documents, {
            returning: true,
          });
        }
      }

      // Return the created structure with its relationships
      const result = await Structure.findByPk(structure.str_id, {
        include: [
          { model: Province_structure, include: [Localite_operationnelle] },
          { model: Domaine_structure },
        ]
      });

      return res.status(201).json(result);
    } catch (error) {
      console.log(error);
      
      console.error("Error creating structure:", error);
      return res.status(500).json({
        message: "Une erreur est survenue lors de la création de la structure",
        error: error.message,
      });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const structure = await Structure.findOne({
      where: { 
        str_designation: req.query.str_designation,
        str_province_siege_sociale: req.query.str_province_siege_sociale,
        str_annee_creation : req.query.str_annee_creation,
      },
      attibutes: [
        "str_designation",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "createdAt",
        "str_staut_verification",
      ],
    });
    if (!structure) {
      return res.status(404).json({ message: 'Structure introuvable' });
    }
    res.json(structure);
  } catch (error) {
    console.error('Error fetching structure:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la recherche de la structure' });
  }
});

module.exports = router;
