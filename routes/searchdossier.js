const express = require("express");
const router = express.Router();
const {
  Structure,
  Affectation,
  Projet,
  Structure_renseignement,
  Domaine_structure
} = require("../models");
const auth = require("../middleware/auth");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

// recherche de dossiers affectés à sa direction par désignation ou sigle
router.get("/", auth, async function (req, res, next) {
  try {
    const { search } = req.query;
    
    // Construction dynamique du where
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { str_designation: { [Op.like]: `%${search}%` } },
        { str_sigle: { [Op.like]: `%${search}%` } }
      ];
    }

    // Construction de l'include
    const includeClause = [
      {   
        model: Affectation, 
        where: { 
          aff_direction: req.query.direction,
          aff_id: {
            [Op.eq]: sequelize.literal(`(
              SELECT aff_id FROM Affectations 
              WHERE Affectations.str_id = Structure.str_id 
              ORDER BY createdAt DESC LIMIT 1
            )`)
          }
        },
        required: true,
      },
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    const dossiers = await Structure.findAll({
      where: whereClause,
      attributes: [
        "str_id",
        "str_designation",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "str_code",
        "createdAt",
      ],
      include: includeClause,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(dossiers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.get("/controleur", auth, async function (req, res, next) {
  try {
    const { search } = req.query;
    
    // Construction dynamique du where
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { str_designation: { [Op.like]: `%${search}%` } },
        { str_sigle: { [Op.like]: `%${search}%` } }
      ];
    }

    // Construction de l'include
    const includeClause = [
      {   
        model: Affectation,
        required: true,
      },
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    const dossiers = await Structure.findAll({
      where: whereClause,
      attributes: [
        "str_id",
        "str_designation",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "createdAt",
        "str_code",
      ],
      include: includeClause,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/audit", auth, async function (req, res, next) {
  try {
    const { search } = req.query;
    
    // Construction dynamique du where
    const whereClause = { 
      str_statut: {
        [Op.ne]: "soumis"
      }
    };
    if (search) {
      whereClause[Op.or] = [
        { str_designation: { [Op.like]: `%${search}%` } },
        { str_sigle: { [Op.like]: `%${search}%` } }
      ];
    }

    // Construction de l'include
    const includeClause = [
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    const dossiers = await Structure.findAll({
      where: whereClause,
      attributes: [
        "str_id",
        "str_designation",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "str_code",
        "createdAt",
      ],
      include: includeClause,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/juridique", auth, async function (req, res, next) {
  try {
    const { search } = req.query;
    
    // Construction dynamique du where
    const whereClause = { 
      str_statut: "accepté dans l'écosystème"
    };
    if (search) {
      whereClause[Op.or] = [
        { str_designation: { [Op.like]: `%${search}%` } },
        { str_sigle: { [Op.like]: `%${search}%` } }
      ];
    }

    // Construction de l'include
    const includeClause = [
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    const dossiers = await Structure.findAll({
      where: whereClause,
      attributes: [
        "str_id",
        "str_designation",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "str_code",
        "createdAt",
      ],
      include: includeClause,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/finance", auth, async function (req, res, next) {
  try {
    const { search } = req.query;
    
    // Construction dynamique du where
    const whereClause = { 
      str_statut: "accepté dans l'écosystème"
    };
    if (search) {
      whereClause[Op.or] = [
        { str_designation: { [Op.like]: `%${search}%` } },
        { str_sigle: { [Op.like]: `%${search}%` } }
      ];
    }

    // Construction de l'include
    const includeClause = [
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    const dossiers = await Structure.findAll({
      where: whereClause,
      attributes: [
        "str_id",
        "str_designation",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "str_code",
        "createdAt",
      ],
      include: includeClause,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
