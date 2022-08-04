const { Router } = require('express')
const { 
  getAllForms, 
  getFormById, 
  createNewForm,
  updateFormById, 
  deleteFormById 
} = require('../controllers/form-controller')

const router = Router();

router.get('/', getAllForms);
router.post('/', createNewForm);

router.get('/:formId', getFormById);
router.put('/:formId', updateFormById);
router.delete('/:formId', deleteFormById);

module.exports = router;