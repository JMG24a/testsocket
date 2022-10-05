const { Router } = require('express');
const passport = require('passport');
const {
  getAllForms,
  getFormById,
  createNewForm,
  updateFormById,
  deleteFormById,
  getAutocompleted,
  putImageForm,
  getImageForm
} = require('../controllers/form-controller')
const { validatorRoles } = require('../auth/middleware/roles');
const { validateToken } = require('../auth/middleware/jwt');
const uploadFiles = require('../middleware/multer');

const router = Router();

router.get(
  '/',
  getAllForms
);

router.get(
  '/download/:idFile',
  getImageForm
);

router.get(
  '/:formId',
  getFormById
);

router.post(
  '/',
  createNewForm
);


router.put(
  '/formimage/:formId',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  uploadFiles(),
  putImageForm
);

router.put(
  '/:formId',
  passport.authenticate('jwt', {session: false}),
  validatorRoles(['employee']),
  updateFormById
);


router.delete(
  '/:formId',
  passport.authenticate('jwt', {session: false}),
  validatorRoles(['employee']),
  deleteFormById
);

module.exports = router;
