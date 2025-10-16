var express = require('express');
var router = express.Router();
const { 
  Structure,
  Structure_renseignement,
  Affectation,
  Domaine,
  Domaine_structure
} = require("../models");
const { Sequelize } = require('sequelize');
const auth = require("../middleware/auth");

// GET dashboard statistics
router.get("/", auth, async function (req, res, next) {
  try {
    // ONG admis à l'écosystème
    const ongAdmis = await Structure.count({
      where: { str_statut: "accepté dans l'écosystème" }
    });

    // Associations des victimes admises
    const associationsVictimesAdmises = await Structure.count({
      where: { str_statut: "accepté dans l'écosystème" },
      include: [{
        model: Structure_renseignement,
        where: { sres_is_association_victime: true },
        required: true
      }]
    });

    // Candidatures en cours de traitement (sans affectation)
    const candidaturesEnCours = await Structure.count({
      where: {
        str_statut_verification: "en cours de traitement",
      }
    });

    // Candidatures rejetées
    const candidaturesRejetees = await Structure.count({
      where: { str_statut_verification: "rejeté" }
    });

    // Total de toutes les candidatures
    const totalCandidatures = await Structure.count();

    // Candidatures rejetées après due diligence
    const candidaturesRejeteesApresDueDiligence = await Structure.count({
      where: { str_statut: "rejeté après due diligence" }
    });

    // Structures par province (acceptées dans l'écosystème)
    const structuresParProvince = await Structure.findAll({
      attributes: [
        'str_province_siege_sociale',
        [Sequelize.fn('COUNT', Sequelize.col('str_id')), 'count']
      ],
      where: { str_statut: "accepté dans l'écosystème" },
      group: ['str_province_siege_sociale'],
      raw: true
    });

    // Template des provinces avec coordonnées
    const provincesData = [
      { name: 'Kinshasa', lat: -4.3317, lng: 15.3139, value: 0 },
      { name: 'Kongo-Central', lat: -5.0968, lng: 13.4637, value: 0 },
      { name: 'Kwango', lat: -5.0334, lng: 17.4821, value: 0 },
      { name: 'Kwilu', lat: -4.8655, lng: 18.6159, value: 0 },
      { name: 'Maï-Ndombe', lat: -2.1951, lng: 18.0726, value: 0 },
      { name: 'Kasaï', lat: -5.0358, lng: 20.7500, value: 0 },
      { name: 'Kasaï-Central', lat: -5.8965, lng: 22.4170, value: 0 },
      { name: 'Kasaï-Oriental', lat: -6.1200, lng: 23.5900, value: 0 },
      { name: 'Lomami', lat: -6.1481, lng: 24.4897, value: 0 },
      { name: 'Sankuru', lat: -2.9214, lng: 23.6172, value: 0 },
      { name: 'Maniema', lat: -2.8540, lng: 25.8502, value: 0 },
      { name: 'Sud-Kivu', lat: -2.4908, lng: 28.8643, value: 0 },
      { name: 'Nord-Kivu', lat: -0.7167, lng: 29.2333, value: 0 },
      { name: 'Ituri', lat: 1.5733, lng: 29.8181, value: 0 },
      { name: 'Haut-Uele', lat: 3.4618, lng: 28.3501, value: 0 },
      { name: 'Tshopo', lat: 0.5190, lng: 25.1972, value: 0 },
      { name: 'Bas-Uele', lat: 2.1827, lng: 23.5904, value: 0 },
      { name: 'Nord-Ubangi', lat: 3.7494, lng: 22.4121, value: 0 },
      { name: 'Mongala', lat: 1.8304, lng: 21.1857, value: 0 },
      { name: 'Tshuapa', lat: -0.1921, lng: 22.4156, value: 0 },
      { name: 'Équateur', lat: 0.0420, lng: 18.2876, value: 0 },
      { name: 'Sud-Ubangi', lat: 2.6397, lng: 19.8029, value: 0 },
      { name: 'Haut-Katanga', lat: -11.6609, lng: 27.4794, value: 0 },
      { name: 'Lualaba', lat: -10.5745, lng: 25.6571, value: 0 },
      { name: 'Haut-Lomami', lat: -8.4404, lng: 24.7473, value: 0 },
      { name: 'Tanganyika', lat: -6.2663, lng: 27.8872, value: 0 },
    ];

    // Remplir les valeurs avec les données réelles
    structuresParProvince.forEach(item => {
      const provinceName = item.str_province_siege_sociale;
      const count = parseInt(item.count);
      const province = provincesData.find(p => p.name === provinceName);
      if (province) {
        province.value = count;
      }
    });

    // Statut par statut
    // Soumises : structures sans affectation
    const soumises = await Structure.count({
      include: [{
        model: Affectation,
        required: false
      }],
      where: {
        '$Affectations.aff_id$': null
      }
    });

    // En cours
    const enCours = await Structure.count({
      where: { str_statut_verification: "en cours de traitement" },
      include: [{
        model: Affectation,
        required: true
      }]
    });

    // Validées
    const validees = await Structure.count({
      where: { str_statut: "accepté dans l'écosystème" }
    });

    // Rejetées
    const rejetees = await Structure.count({
      where: { str_statut_verification: "rejeté" }
    });

    const statusData = [
      { name: 'Soumises', value: soumises },
      { name: 'En cours de traitement', value: enCours },
      { name: 'Validées', value: validees },
      { name: 'Rejetées', value: rejetees },
    ];

    // Structures par mois de soumission
    const currentYear = new Date().getFullYear();
    const structuresParMois = await Structure.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'mois'],
        [Sequelize.fn('COUNT', Sequelize.col('str_id')), 'count']
      ],
      where: Sequelize.where(
        Sequelize.fn('YEAR', Sequelize.col('createdAt')),
        currentYear
      ),
      group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
      raw: true
    });

    // Template des mois
    const timeSeriesData = [
      { name: 'Jan', value: 0 },
      { name: 'Fév', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Avr', value: 0 },
      { name: 'Mai', value: 0 },
      { name: 'Juin', value: 0 },
      { name: 'Juil', value: 0 },
      { name: 'Août', value: 0 },
      { name: 'Sept', value: 0 },
      { name: 'Oct', value: 0 },
      { name: 'Nov', value: 0 },
      { name: 'Déc', value: 0 },
    ];

    // Remplir les valeurs avec les données réelles
    structuresParMois.forEach(item => {
      const moisIndex = parseInt(item.mois) - 1;
      const count = parseInt(item.count);
      if (moisIndex >= 0 && moisIndex < 12) {
        timeSeriesData[moisIndex].value = count;
      }
    });

    // Structures par domaine
    const structuresParDomaine = await Domaine_structure.findAll({
      attributes: [
        'dom_id',
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('str_id'))), 'count']
      ],
      include: [{
        model: Domaine,
        attributes: ['dom_designation']
      }],
      group: ['dom_id', 'Domaine.dom_id', 'Domaine.dom_designation'],
      raw: true
    });

    // Compter les structures avec str_domaine_activite non nul
    const structuresAutres = await Structure.count({
      where: {
        str_domaine_activite: {
          [Sequelize.Op.ne]: null
        }
      }
    });

    // Créer domainData
    const domainData = structuresParDomaine.map(item => ({
      name: item['Domaine.dom_designation'],
      value: parseInt(item.count)
    }));

    // Ajouter "Autres" si nécessaire
    if (structuresAutres > 0) {
      domainData.push({
        name: 'Autres',
        value: structuresAutres
      });
    }

    // Structures récentes (5 dernières sans affectation)
    const idsStructuresAffectees = await Affectation.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('str_id')), 'str_id']],
      raw: true
    }).then(results => results.map(r => r.str_id));

    const structuresRecentes = await Structure.findAll({
      where: { 
        str_id: {
          [Sequelize.Op.notIn]: idsStructuresAffectees.length > 0 ? idsStructuresAffectees : ['']
        }
      },
      attributes: [
        "str_id",
        "str_designation",
        "str_sigle",
        "str_annee_creation",
        "str_province_siege_sociale",
        "str_statut",
        "createdAt",
      ],
      include: [
        { 
          model: Structure_renseignement,
          attributes: ['sres_is_association_victime']
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 5
    });

    // Formatter recentOrgs
    const recentOrgs = structuresRecentes.map(structure => {
      const isAssociation = structure.Structure_renseignements?.[0]?.sres_is_association_victime;

      const date = new Date(structure.createdAt);
      const dateCreation = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

      return {
        id: structure.str_id,
        name: structure.str_sigle || structure.str_designation,
        type: isAssociation ? 'Association de victimes' : 'ONG',
        dateCreation,
        province: structure.str_province_siege_sociale,
        status : structure.str_statut 
      };
    });

    const data = {
      indicateurs: {
        ongAdmis,
        associationsVictimesAdmises,
        candidaturesEnCours,
        candidaturesRejetees,
        totalCandidatures,
        candidaturesRejeteesApresDueDiligence
      },
      provincesData,
      statusData,
      timeSeriesData,
      domainData,
      recentOrgs
    }

    return res.status(200).json(
      data
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
