const express = require("express");
const router = express.Router();
const {
  Structure,
  Province_structure,
  Province,
  Affectation,
  Document,
  Domaine_structure,
  Localite_operationnelle,
  Domaine,
  Structure_renseignement,
  Traitement,
  Bailleur
} = require("../models");
const auth = require("../middleware/auth");
const { Op } = require('sequelize');
const XLSX = require("xlsx");

// recuperation de toutes les structures avec statut soumis par le controleur
router.get("/", auth, async function (req, res, next) {
  try {
    // Récupérer les IDs des structures déjà affectées
    const structuresAffectees = await Affectation.findAll({
      attributes: ['str_id'],
      raw: true
    });

    const idsStructuresAffectees = structuresAffectees.map(aff => aff.str_id);

    const structuresNonAffectees = await Structure.findAll({
      where: { 
        str_statut: "soumis",
        str_id: {
          [Op.notIn]: idsStructuresAffectees
        }
      },
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
      include:[
         { model : Structure_renseignement,
          attributes:['sres_is_association_victime']
         }
      ],
       order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(structuresNonAffectees);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// filtrage des candidatures par province, domaine, statut
router.get("/filter", auth, async function (req, res, next) {
  try {
    const { province, domaine, statut } = req.query;

    // Récupérer les IDs des structures déjà affectées
    const structuresAffectees = await Affectation.findAll({
      attributes: ['str_id'],
      raw: true
    });

    const idsStructuresAffectees = structuresAffectees.map(aff => aff.str_id);

    // Construction dynamique du where
    const whereClause = {
      str_statut: "soumis",
      str_id: {
        [Op.notIn]: idsStructuresAffectees
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

    const candidatures = await Structure.findAll({
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

    return res.status(200).json(candidatures);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// recherche de candidatures par désignation ou sigle
router.get("/search", auth, async function (req, res, next) {
  try {
    const { search } = req.query;

    // Récupérer les IDs des structures déjà affectées
    const structuresAffectees = await Affectation.findAll({
      attributes: ['str_id'],
      raw: true
    });

    const idsStructuresAffectees = structuresAffectees.map(aff => aff.str_id);

    // Construction dynamique du where
    const whereClause = {
      str_statut: "soumis",
      str_id: {
        [Op.notIn]: idsStructuresAffectees
      }
    };

    if (search) {
      whereClause[Op.or] = [
        { str_designation: { [Op.like]: `%${search}%` } },
        { str_sigle: { [Op.like]: `%${search}%` } }
      ];
    }

    const candidatures = await Structure.findAll({
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
      include: [
        { 
          model: Structure_renseignement,
          attributes: ['sres_is_association_victime']
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(candidatures);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// export Excel des candidatures avec filtres
router.get("/export", auth, async function (req, res, next) {
  try {
    const { province, domaine, statut } = req.query;

    // Récupérer les IDs des structures déjà affectées
    const structuresAffectees = await Affectation.findAll({
      attributes: ['str_id'],
      raw: true
    });

    const idsStructuresAffectees = structuresAffectees.map(aff => aff.str_id);

    // Construction dynamique du where
    const whereClause = {
      str_statut: "soumis",
      str_id: {
        [Op.notIn]: idsStructuresAffectees
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

    const candidatures = await Structure.findAll({
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
    const excelData = candidatures.map(candidature => ({
      "Code": candidature.str_code,
      "Désignation": candidature.str_designation,
      "Sigle": candidature.str_sigle,
      "Statut": candidature.str_statut,
      "Année de création": candidature.str_annee_creation,
      "Adresse du siège": candidature.str_adresse_siege_sociale,
      "Province": candidature.str_province_siege_sociale,
      "Date de soumission": candidature.createdAt
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
      { wch: 20 }   // Date de soumission
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Candidatures");

    // Génération du buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Envoi du fichier
    res.setHeader("Content-Disposition", "attachment; filename=candidatures.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// recuperation d'une candidature par son id
router.get('/:str_id',auth,async function(req,res,next){
  try {
    const { str_id } = req.params;
    const structure = await Structure.findOne({
      where: { str_id },
      include: [
        { model: Province_structure, 
            include:[
                {model : Province, attributes: ["pro_designation"]},
                { model: Localite_operationnelle }
            ]
         },
         { model : Domaine_structure,
          include: [
            { model : Domaine, attributes: ["dom_designation"] }
          ]
         },
         { model : Document },
         { model : Bailleur },
         { model : Structure_renseignement },
         { model : Affectation },
         { model : Traitement,
          order: [["createdAt", "DESC"]]},
      ],
    });
    if (!structure) {
      return res.status(404).json({ message: "Structure not found" });
    }
    return res.status(200).json(structure);
  } catch (error) {
   res.status(500).send(error.message); 
  }
})

//affectation de la structure à une direction
router.post("/affectation", auth ,async function (req, res, next) {
  try {
    const { str_id, direction, user } = req.body;
    
    const structure = await Structure.findByPk(str_id);
    if (!structure) {
      return res.status(404).json({ message: "Structure not found" });
    }
    
    await Affectation.create({
      str_id,
      aff_direction: direction,
    });

    await Structure.update(
      {
        str_statut_verification: "en cours de traitement",
      },
      { where: { str_id } }
    );

    await Traitement.create({
      str_id,
      tr_usr_id: user.id,
      tr_usr_nom: user.nom + " " + user.prenom,
      tr_usr_mail: user.email,
      tr_usr_direction: user.direction,
      tr_usr_profil: user.profil,
      tr_usr_signature: user.signature,
      tr_action: `affectation du dossier de candidature à la direction ${direction}`
    });

    return res
      .status(201)
      .json({
        message: "la structure a bien été affectée à la direction",
        success: true,
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
