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
  Projet
} = require("../models");
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

// recuperation de tous les dossiers affectés à sa direction
router.get("/", auth, async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const dossiers = await Structure.findAll({
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
      include:[
        {   model: Affectation, 
            where: { aff_direction: req.query.direction },
            required: true,
         },
      ],
      transaction
    });

    await transaction.commit();
    return res.status(200).json(dossiers);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

router.get("/controleurs", auth, async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const dossiers = await Structure.findAll({
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
      include:[
        {   model: Affectation,
            required: true,
         },
      ],
      transaction
    });

    await transaction.commit();
    return res.status(200).json(dossiers);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

router.get("/audit", auth, async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const dossiers = await Structure.findAll({
      where: { 
        str_statut: {
          [Op.ne]: "soumis" // Ne pas égal à "soumis"
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
        "createdAt",
      ],
      transaction
    });

    await transaction.commit();
    return res.status(200).json(dossiers);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

router.get("/juridique", auth, async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const dossiers = await Structure.findAll({
      where: { 
        str_statut:  "accepté dans l'écosystème" // Ne pas égal à "soumis"
      },
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
      transaction
    });

    await transaction.commit();
    return res.status(200).json(dossiers);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

router.get("/finance", auth, async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const dossiers = await Structure.findAll({
      where: { 
        str_statut:  "accepté dans l'écosystème" // Ne pas égal à "soumis"
      },
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
      transaction
    });

    await transaction.commit();
    return res.status(200).json(dossiers);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

// recuperation d'un dossier par son id
router.get('/:str_id',auth,async function(req,res,next){
  const transaction = await sequelize.transaction();
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
          order: [["createdAt", "ASC"]]},
        { model : Projet }
      ],
      transaction
    });
    if (!structure) {
      await transaction.rollback();
      return res.status(404).json({ message: "Structure not found" });
    }
    await transaction.commit();
    return res.status(200).json(structure);
  } catch (error) {
    await transaction.rollback();
   res.status(500).send(error.message); 
  }
})

//validation de la structure
router.patch("/validation", auth ,async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { str_id, commentaire, user } = req.body;
    
    const structure = await Structure.findByPk(str_id, { transaction });
    if (!structure) {
      await transaction.rollback();
      return res.status(404).json({ message: "Structure not found" });
    }

    await Structure.update(
      {
        str_statut: "admis à la due diligence",
      },
      { where: { str_id }, transaction }
    );

    await Traitement.create({
      str_id,
      tr_usr_id: user.id,
      tr_usr_nom: user.nom + " " + user.prenom,
      tr_usr_mail: user.email,
      tr_usr_direction: user.direction,
      tr_usr_profil: user.profil,
      tr_usr_signature: user.signature,
      tr_commentaire: commentaire,
      tr_statut: "validé",
      tr_action: `Validation du dossier de candidature `
    }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json({
        message: "la candidature a été validée avec succès",
        success: true,
      });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

//rejet de la structure
router.patch("/rejet", auth ,async function (req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { str_id, commentaire, user } = req.body;
    
    const structure = await Structure.findByPk(str_id, { transaction });
    if (!structure) {
      await transaction.rollback();
      return res.status(404).json({ message: "Structure not found" });
    }

    await Structure.update(
      {
        str_statut: "rejeté",
        str_statut_verification: "rejeté",
      },
      { where: { str_id }, transaction }
    );

    await Traitement.create({
      str_id,
      tr_usr_id: user.id,
      tr_usr_nom: user.nom + " " + user.prenom,
      tr_usr_mail: user.email,
      tr_usr_direction: user.direction,
      tr_usr_profil: user.profil,
      tr_usr_signature: user.signature,
      tr_commentaire: commentaire,
      tr_statut: "rejeté",
      tr_action: `Rejet du dossier de candidature `
    }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json({
        message: "la candidature a été rejetée avec succès",
        success: true,
      });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});

//due diligence de la structure
router.patch("/duediligence", upload.any(), auth ,async function (req, res, next) {

  let { str_id, risque, user, commentaire } = req.body;
  user = JSON.parse(user)

  const transaction = await sequelize.transaction();
  try {
    
    const structure = await Structure.findByPk(str_id, { transaction });
    if (!structure) {
      await transaction.rollback();
      return res.status(404).json({ message: "Structure not found" });
    }

    await Structure.update(
      {
        str_niveau_risque: risque,
      },
      { where: { str_id }, transaction }
    );

    await Traitement.create({
      str_id,
      tr_usr_id: user.id,
      tr_usr_nom: user.nom + " " + user.prenom,
      tr_usr_mail: user.email,
      tr_usr_direction: user.direction,
      tr_usr_profil: user.profil,
      tr_usr_signature: user.signature,
      tr_commentaire: commentaire,
      tr_action: `Ajout du niveau de risque après due diligence `
    }, { transaction });

    if(risque == 'Élevé' || risque == 'Très élevé'){
      await Structure.update(
      {
        str_statut: 'rejeté après due diligence',
        str_statut_verification: 'rejeté',
      },
      { where: { str_id }, transaction }
    );
    }else{
      await Structure.update(
      {
        str_statut: "accepté dans l'écosystème",
        str_statut_verification: "accepté",
      },
      { where: { str_id }, transaction }
    )
    }

     let documents = [];

    if (req.files && req.files.length > 0) {
        // Process each uploaded file
        for (const file of req.files) {
          documents.push({
            doc_name: file.filename,
            doc_path: file.path,
            doc_size: file.size,
            doc_designation: 'Rapport due diligence',
            str_id: structure.str_id,
          });
        }

        if (documents.length > 0) {
          await Document.bulkCreate(documents, {
            transaction,
            returning: true,
          });
        }
      }

    await transaction.commit();
    return res
      .status(200)
      .json({
        message: "le niveau due dulgence a été ajouté avec succès",
        success: true,
      });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    
    res.status(500).send(error.message);
  }
});


module.exports = router;
