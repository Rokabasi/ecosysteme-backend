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
const { Op } = require("sequelize");

// recuperation de tous les dossiers affectés à sa direction avec filtres
router.get("/", auth, async function (req, res, next) {
  try {
    const { province, domaine, statut } = req.query;
    
    // Construction dynamique du where
    const whereClause = {};
    if (province) {
      whereClause.str_province_siege_sociale = province;
    }
    if (statut) {
      whereClause.str_statut = statut;
    }

    // Construction de l'include
    const includeClause = [
      {   
        model: Affectation, 
        where: { aff_direction: req.query.direction },
        required: true,
      },
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    // Ajout de la condition pour domaine via Domaine_structure
    if (domaine) {
      includeClause.push({
        model: Domaine_structure,
        where: { dom_id: domaine },
        required: true
      });
    }

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
    const { province, domaine, statut } = req.query;
    
    // Construction dynamique du where
    const whereClause = {};
    if (province) {
      whereClause.str_province_siege_sociale = province;
    }
    if (statut) {
      whereClause.str_statut = statut;
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

    // Ajout de la condition pour domaine via Domaine_structure
    if (domaine) {
      includeClause.push({
        model: Domaine_structure,
        where: { dom_id: domaine },
        required: true
      });
    }

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
    const { province, domaine, statut } = req.query;
    
    // Construction dynamique du where
    const whereClause = { 
      str_statut: {
        [Op.ne]: "soumis"
      }
    };
    if (province) {
      whereClause.str_province_siege_sociale = province;
    }
    if (statut) {
      whereClause.str_statut = statut;
    }

    // Construction de l'include
    const includeClause = [
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    // Ajout de la condition pour domaine via Domaine_structure
    if (domaine) {
      includeClause.push({
        model: Domaine_structure,
        where: { dom_id: domaine },
        required: true
      });
    }

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
    const { province, domaine, statut } = req.query;
    
    // Construction dynamique du where
    const whereClause = { 
      str_statut: "accepté dans l'écosystème"
    };
    if (province) {
      whereClause.str_province_siege_sociale = province;
    }
    if (statut) {
      whereClause.str_statut = statut;
    }

    // Construction de l'include
    const includeClause = [
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    // Ajout de la condition pour domaine via Domaine_structure
    if (domaine) {
      includeClause.push({
        model: Domaine_structure,
        where: { dom_id: domaine },
        required: true
      });
    }

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
    const { province, domaine, statut } = req.query;
    
    // Construction dynamique du where
    const whereClause = { 
      str_statut: "accepté dans l'écosystème"
    };
    if (province) {
      whereClause.str_province_siege_sociale = province;
    }
    if (statut) {
      whereClause.str_statut = statut;
    }

    // Construction de l'include
    const includeClause = [
      { model: Projet },
      { 
        model: Structure_renseignement,
        attributes: ['sres_is_association_victime']
      }
    ];

    // Ajout de la condition pour domaine via Domaine_structure
    if (domaine) {
      includeClause.push({
        model: Domaine_structure,
        where: { dom_id: domaine },
        required: true
      });
    }

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
