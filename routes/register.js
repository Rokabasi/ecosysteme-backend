var express = require("express");
var router = express.Router();
const { Structure } = require("../models");

/* GET users listing. */
router.get("/", function (req, res, next) {
  try {
    const structures = Structure.findAll();
    return res.status(200).json(structures);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
