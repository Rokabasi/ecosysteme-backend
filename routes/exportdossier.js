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
const XLSX = require("xlsx");

// Export Excel - tous les dossiers affectés à sa direction avec filtres
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
        where: { 
          aff_direction: req.query.direction,
          aff_id: {
            [Op.eq]: sequelize.literal(`(
              SELECT aff_id FROM affectations 
              WHERE affectations.str_id = Structure.str_id 
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

    // Préparation des données pour Excel
    const excelData = dossiers.map(dossier => ({
      "Code": dossier.str_code,
      "Désignation": dossier.str_designation,
      "Sigle": dossier.str_sigle,
      "Statut": dossier.str_statut,
      "Année de création": dossier.str_annee_creation,
      "Adresse du siège": dossier.str_adresse_siege_sociale,
      "Province": dossier.str_province_siege_sociale,
      "Nombre de projets": dossier.Projets ? dossier.Projets.length : 0,
      "Date de soumission": dossier.createdAt
    }));

    // Création du workbook et worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Définir la largeur des colonnes
    ws['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Désignation
      { wch: 15 },  // Sigle
      { wch: 35 },  // Statut
      { wch: 18 },  // Année de création
      { wch: 45 },  // Adresse du siège
      { wch: 20 },  // Province
      { wch: 18 },  // Nombre de projets
      { wch: 20 }   // Date de soumission
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Dossiers");

    // Génération du buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Envoi du fichier
    res.setHeader("Content-Disposition", "attachment; filename=dossiers.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Export Excel - controleur
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

    // Préparation des données pour Excel
    const excelData = dossiers.map(dossier => ({
      "Code": dossier.str_code,
      "Désignation": dossier.str_designation,
      "Sigle": dossier.str_sigle,
      "Statut": dossier.str_statut,
      "Année de création": dossier.str_annee_creation,
      "Adresse du siège": dossier.str_adresse_siege_sociale,
      "Province": dossier.str_province_siege_sociale,
      "Nombre de projets": dossier.Projets ? dossier.Projets.length : 0,
      "Date de soumission": dossier.createdAt
    }));

    // Création du workbook et worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Définir la largeur des colonnes
    ws['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Désignation
      { wch: 15 },  // Sigle
      { wch: 35 },  // Statut
      { wch: 18 },  // Année de création
      { wch: 45 },  // Adresse du siège
      { wch: 20 },  // Province
      { wch: 18 },  // Nombre de projets
      { wch: 20 }   // Date de soumission
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Dossiers");

    // Génération du buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Envoi du fichier
    res.setHeader("Content-Disposition", "attachment; filename=dossiers_controleur.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Export Excel - audit
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

    // Préparation des données pour Excel
    const excelData = dossiers.map(dossier => ({
      "Code": dossier.str_code,
      "Désignation": dossier.str_designation,
      "Sigle": dossier.str_sigle,
      "Statut": dossier.str_statut,
      "Année de création": dossier.str_annee_creation,
      "Adresse du siège": dossier.str_adresse_siege_sociale,
      "Province": dossier.str_province_siege_sociale,
      "Nombre de projets": dossier.Projets ? dossier.Projets.length : 0,
      "Date de soumission": dossier.createdAt
    }));

    // Création du workbook et worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Définir la largeur des colonnes
    ws['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Désignation
      { wch: 15 },  // Sigle
      { wch: 35 },  // Statut
      { wch: 18 },  // Année de création
      { wch: 45 },  // Adresse du siège
      { wch: 20 },  // Province
      { wch: 18 },  // Nombre de projets
      { wch: 20 }   // Date de soumission
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Dossiers");

    // Génération du buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Envoi du fichier
    res.setHeader("Content-Disposition", "attachment; filename=dossiers_audit.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Export Excel - juridique
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

    // Préparation des données pour Excel
    const excelData = dossiers.map(dossier => ({
      "Code": dossier.str_code,
      "Désignation": dossier.str_designation,
      "Sigle": dossier.str_sigle,
      "Statut": dossier.str_statut,
      "Année de création": dossier.str_annee_creation,
      "Adresse du siège": dossier.str_adresse_siege_sociale,
      "Province": dossier.str_province_siege_sociale,
      "Nombre de projets": dossier.Projets ? dossier.Projets.length : 0,
      "Date de soumission": dossier.createdAt
    }));

    // Création du workbook et worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Définir la largeur des colonnes
    ws['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Désignation
      { wch: 15 },  // Sigle
      { wch: 35 },  // Statut
      { wch: 18 },  // Année de création
      { wch: 45 },  // Adresse du siège
      { wch: 20 },  // Province
      { wch: 18 },  // Nombre de projets
      { wch: 20 }   // Date de soumission
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Dossiers");

    // Génération du buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Envoi du fichier
    res.setHeader("Content-Disposition", "attachment; filename=dossiers_juridique.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Export Excel - finance
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

    // Préparation des données pour Excel
    const excelData = dossiers.map(dossier => ({
      "Code": dossier.str_code,
      "Désignation": dossier.str_designation,
      "Sigle": dossier.str_sigle,
      "Statut": dossier.str_statut,
      "Année de création": dossier.str_annee_creation,
      "Adresse du siège": dossier.str_adresse_siege_sociale,
      "Province": dossier.str_province_siege_sociale,
      "Nombre de projets": dossier.Projets ? dossier.Projets.length : 0,
      "Date de soumission": dossier.createdAt
    }));

    // Création du workbook et worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Définir la largeur des colonnes
    ws['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Désignation
      { wch: 15 },  // Sigle
      { wch: 35 },  // Statut
      { wch: 18 },  // Année de création
      { wch: 45 },  // Adresse du siège
      { wch: 20 },  // Province
      { wch: 18 },  // Nombre de projets
      { wch: 20 }   // Date de soumission
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Dossiers");

    // Génération du buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Envoi du fichier
    res.setHeader("Content-Disposition", "attachment; filename=dossiers_finance.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
