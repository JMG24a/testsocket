const { Router } = require('express');
const router = Router();
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const product = await Product.find();

  res.status(200).json({
    msg: 'Listado de productos',
    product,
  });
};

const postProducts = async (req, res) => {
  const body = req.body;
  try {
    const product = new Product(body);

    const newProduct = await product.save();

    res.status(201).json({
      msg: 'Agregado a la lista de productos',
    });
  } catch {
    console.log('error');
  }
};

router.get('/', getProducts);
router.post('/', postProducts);

module.exports = router;
