var express = require('express');
var router = express.Router();
const { 
  Province
} = require("../models");
const auth = require("../middleware/auth");

// GET all domaines
router.get("/", async function (req, res, next) {
  try {
    const provinces = await Province.findAll({
      where: { pro_statut: true }
    });
    return res.status(200).json(provinces);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET all domaines
router.get("/admin",auth ,async function (req, res, next) {
  try {
    const provinces = await Province.findAll();
    return res.status(200).json(provinces);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
