var express = require('express');
var router = express.Router();
const { 
  Domaine
} = require("../models");
const auth = require('../middleware/auth');

// GET all domaines
router.get("/admin" ,auth,async function (req, res, next) {
  try {
    const domaines = await Domaine.findAll();
    return res.status(200).json(domaines);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET all domaines
router.get("/" ,async function (req, res, next) {
  try {
    const domaines = await Domaine.findAll({
      where: { dom_statut: true },
    });
    return res.status(200).json(domaines);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/update/:dom_id",auth ,async function (req, res, next) {
  try {
    const domaine = await Domaine.findByPk(req.params.dom_id);
    if (!domaine) {
      return res.status(404).json({ message: "domaine not found" });
    }
    await Domaine.update( { dom_designation: req.body.dom_designation }, { where: { dom_id: req.params.dom_id } });

    return res.status(200).json(`Domaine modifié avec succès`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/:dom_id",auth ,async function (req, res, next) {
  try {
    const domaine = await Domaine.findByPk(req.params.dom_id);
    if (!domaine) {
      return res.status(404).json({ message: "domaine not found" });
    }
    await Domaine.update( { dom_statut: !domaine.dom_statut }, { where: { dom_id: req.params.dom_id } });

    return res.status(200).json(`Domaine ${domaine.dom_statut ? "desactivé" : "activé"} avec succès`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/",auth ,async function (req, res, next) {
  try {
    const oldDomaine = await Domaine.findOne({
      where: { dom_designation: req.body.dom_designation }
    });
    if (oldDomaine) {
      return res.status(409).json({ message: "Ce domaine est déjà enregistré" });
    }
    await Domaine.create({
      dom_designation: req.body.dom_designation,
      dom_statut: true,
    });

    return res.status(200).json(`Domaine créé avec succès`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
