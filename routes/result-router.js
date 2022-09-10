const { Router } = require('express');
// const passport = require('passport');
//service
const resultService = require('../controllers/result-controller')
const procedureService = require('../controllers/procedure-controller')
const authController = require('../controllers/auth')
//init
const router = Router();

const getResult = async (req, res) => {
  const {idProcedure} = req.params
  const procedureInfo = await procedureService.getOneProcedure(idProcedure);
  const namePDF = resultService.generatorPDF(procedureInfo)

  res.json({url: `http://localhost:3001/app/pdf/${namePDF}.pdf`})
};

const getResultByEmail = async (req, res) => {
  const {idProcedure, email} = req.params
  const procedureInfo = await procedureService.getOneProcedure(idProcedure);
  const namePDF = resultService.generatorPDF(procedureInfo)

  await authController.sendPDF(namePDF, email)

  res.json({url: `http://localhost:3001/app/pdf/${namePDF}.pdf`})
};

router.get(
  '/email/:idProcedure',
  // passport.authenticate('jwt', {session: false}), validatorRoles(['admin']),
  getResultByEmail
);

router.get(
  '/:idProcedure',
  // passport.authenticate('jwt', {session: false}), validatorRoles(['admin']),
  getResult
);



module.exports = router;
