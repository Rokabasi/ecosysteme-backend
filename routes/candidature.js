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
  Traitement
} = require("../models");
const auth = require("../middleware/auth");

// recuperation de toutes les structures avec statut soumis par le controleur
router.get("/", auth, async function (req, res, next) {
  try {
    const { Op } = require('sequelize');
    const { Affectation } = require('../models');

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
      ]
    });

    return res.status(200).json(structuresNonAffectees);
  } catch (error) {
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
