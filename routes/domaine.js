var express = require('express');
var router = express.Router();
const { 
  Domaine
} = require("../models");

// GET all domaines
router.get("/" ,async function (req, res, next) {
  try {
    const domaines = await Domaine.findAll();
    return res.status(200).json(domaines);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
