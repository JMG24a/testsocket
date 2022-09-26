const { Router } = require('express');
const passport = require('passport');
const {
  getAllForms,
  getFormById,
  createNewForm,
  updateFormById,
  deleteFormById,
  getAutocompleted,
  putImageForm
} = require('../controllers/form-controller')
const { validatorRoles } = require('../auth/middleware/roles');
const { validateToken } = require('../auth/middleware/jwt');
const uploadFiles = require('../middleware/multer');

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

router.put(
  '/form-image/:formId',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  uploadFiles(),
  putImageForm
);

router.delete(
  '/:formId',
  passport.authenticate('jwt', {session: false}),
  validatorRoles(['admin']),
  deleteFormById
);

module.exports = router;
