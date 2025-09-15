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
  Structure_renseignement
} = require("../models");
const upload = require("../utils/multer");
const auth = require("../middleware/auth");



// recuperation de toutes les structures avec statut soumis par le controleur
router.get("/" ,async function (req, res, next) {
  try {
    const structures = await Structure.findAll({
      where: { str_statut: "soumis" },
      attributes: [
        "str_id",
        "str_designation",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
        "str_province_siege_sociale",
        "createdAt",
      ],
    });
    return res.status(200).json(structures);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// recuperation d'une candidature par son id
router.get('/:str_id',async function(req,res,next){
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
router.post("/:str_id", auth ,async function (req, res, next) {
  try {
    const { str_id, direction } = req.body;
    
    const structure = await Structure.findByPk(str_id);
    if (!structure) {
      return res.status(404).json({ message: "Structure not found" });
    }

    await Affectation.create({
      str_id,
      aff_direction: direction,
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

// recuperation de toutes les structures affectés à sa direction
router.get("/analyste", auth ,async function (req, res, next) {
  try {

    const { direction } = req.query;

    const structures = await Structure.findAll({
      attributes: [
        "str_id",
        "str_nom",
        "str_statut",
        "str_sigle",
        "str_annee_creation",
        "str_adresse_siege_sociale",
      ],
      include: [
        {
          model: Affectation,
          attributes: ["aff_direction"],
          where: {
            aff_direction: direction,
          },
          required: true,
        },
      ],
    });
    return res.status(200).json(structures);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch('/str_id',auth,async function(req,res,next){
  try {
     const { str_id } = req.params;
    
    const structure = await Structure.findByPk(str_id);
    if (!structure) {
      return res.status(404).json({ message: "Structure not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
)

module.exports = router;
