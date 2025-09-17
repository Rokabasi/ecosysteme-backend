const express = require("express");
const router = express.Router();
const {
  Structure,
  Document,
  Traitement,
  Projet
} = require("../models");
const auth = require("../middleware/auth");

//assignation du projet à la structure
router.post("/", upload.any(), auth, async function (req, res, next) {
  let transaction;
  
  try {
    let { 
      pro_code,
      pro_intitule,
      pro_zone,
      pro_date_debut,
      pro_date_fin,
      pro_cout,
      pro_resultat,
      pro_statut,
      str_id,
      user,
      commentaire // Ajout de commentaire pour le traitement
    } = req.body;

    user = JSON.parse(user);
    
    // Début de la transaction
    transaction = await sequelize.transaction();

    const structure = await Structure.findByPk(str_id, { transaction });
    if (!structure) {
      await transaction.rollback();
      return res.status(404).json({ message: "Structure not found" });
    }

    // Création du projet avec transaction
    const nouveauProjet = await Projet.create({
      pro_code,
      pro_intitule,
      pro_zone,
      pro_date_debut,
      pro_date_fin,
      pro_cout,
      pro_resultat,
      pro_statut,
      str_id
    }, { transaction });

    // Création du traitement avec transaction
    await Traitement.create({
      str_id,
      tr_usr_id: user.id,
      tr_usr_nom: user.nom + " " + user.prenom,
      tr_usr_mail: user.email,
      tr_usr_direction: user.direction,
      tr_usr_profil: user.profil,
      tr_usr_signature: user.signature,
      tr_commentaire: commentaire,
      tr_action: `Création du projet ${pro_intitule} (${pro_code})`
    }, { transaction });

    let documents = [];

    if (req.files && req.files.length > 0) {
      // Process each uploaded file with transaction
      for (const file of req.files) {
        documents.push({
          doc_name: file.filename,
          doc_path: file.path,
          doc_size: file.size,
          doc_designation: 'Contrat de projet',
          str_id: structure.str_id,
          pro_id: nouveauProjet.pro_id
        });
      }

      if (documents.length > 0) {
        await Document.bulkCreate(documents, {
          transaction,
          returning: true,
        });
      }
    }

    // Validation de la transaction
    await transaction.commit();

    return res.status(201).json({
      message: "Le projet a été créé avec succès",
      success: true,
    });

  } catch (error) {
    // Rollback en cas d'erreur
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
});

module.exports = router;
