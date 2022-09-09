const { Router } = require('express');

const { 
    getAllInvoices, 
    getInvoiceById,
    createNewInvoice,
} = require('../controllers/invoice-controller');

const router = Router();

router.get('/', getAllInvoices);
router.get('/:invoiceId', getInvoiceById);

router.post('/', createNewInvoice);

module.exports = router;