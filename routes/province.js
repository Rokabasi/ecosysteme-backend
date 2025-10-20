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
      where: { pro_statut: true },
      order: [["pro_designation", "ASC"]],
      attributes: ["pro_id", "pro_designation"]
    });
    return res.status(200).json(provinces);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// GET all domaines
router.get("/admin",auth ,async function (req, res, next) {
  try {
    const provinces = await Province.findAll(
      {
        order: [["pro_designation", "ASC"]],
      }
    );
    return res.status(200).json(provinces);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/:pro_id",auth ,async function (req, res, next) {
  try {
    const province = await Province.findByPk(req.params.pro_id);
    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }
    await Province.update( { pro_statut: !province.pro_statut }, { where: { pro_id: req.params.pro_id } });

    return res.status(200).json(`Province ${province.pro_statut ? "desactivé" : "activé"} avec succès`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
