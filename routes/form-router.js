const { Router } = require('express');
const passport = require('passport');
const {
  getAllForms,
  getFormById,
  createNewForm,
  updateFormById,
  deleteFormById,
  getAutocompleted
} = require('../controllers/form-controller')
const { validatorRoles } = require('../auth/middleware/roles');

const router = Router();

router.get(
  '/',
  getAllForms
);

router.post(
  '/',
  createNewForm
);

router.get(
  '/:formId',
  getFormById
);

router.put(
  '/:formId',
  passport.authenticate('jwt', {session: false}),
  validatorRoles(['admin']),
  updateFormById
);

router.delete(
  '/:formId',
  passport.authenticate('jwt', {session: false}),
  validatorRoles(['admin']),
  deleteFormById
);

module.exports = router;
