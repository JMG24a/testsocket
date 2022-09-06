const { Router } = require('express');

const { 
    getAllFormCategories,
    createFormCategory,
    updateFormCategory,
    deleteFormCategory,
} = require('../controllers/form-category-controller');

const router = Router();

router.get(
    '/',
    getAllFormCategories
);

router.post(
    '/',
    createFormCategory
);

router.put(
    '/:categoryId',
    updateFormCategory
);

router.delete(
    '/:categoryId',
    deleteFormCategory
);

module.exports = router;