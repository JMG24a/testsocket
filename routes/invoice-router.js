const { Router } = require('express');
const passport = require('passport');
const { validateToken } = require('../auth/middleware/jwt');
const { validatorRoles } = require('../auth/middleware/roles');

const {
    getAllInvoices,
    getAllInvoicesUser,
    getInvoiceById,
    createNewInvoice,
} = require('../controllers/invoice-controller');

const router = Router();

router.get(
  '/',
  passport.authenticate('jwt', {session: false}),
  validatorRoles(['employee']),
  getAllInvoices
);

router.get(
  '/user',
  passport.authenticate('jwt', {session: false}),
  validateToken,
  getAllInvoicesUser
);

router.get('/:invoiceId', getInvoiceById);

router.post(
  '/',
  passport.authenticate('jwt', {session: false}),
  validateToken,
  createNewInvoice
);

module.exports = router;
