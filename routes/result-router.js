const { Router } = require('express');
const passport = require('passport');
//service
const resultService = require('../controllers/result-controller')
const procedureService = require('../controllers/procedure-controller')
//init
const router = Router();

const getResult = async (req, res) => {
  const {id} = req.params
  const procedureInfo = await procedureService.getOneProcedure(id);
  const namePDF = resultService.generatorPDF(procedureInfo)

  res.json({url: `http://localhost:3001/app/pdf/${namePDF}.pdf`})
};

router.get(
  '/:id',
  // passport.authenticate('jwt', {session: false}), validatorRoles(['admin']),
  getResult
);
module.exports = router;
