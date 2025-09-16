var express = require('express');
var router = express.Router();
const { 
  Direction
} = require("../models");
const auth = require("../middleware/auth");

// GET all domaines
router.get("/",auth ,async function (req, res, next) {
  try {
    const directions = await Direction.findAll();
    return res.status(200).json(directions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
