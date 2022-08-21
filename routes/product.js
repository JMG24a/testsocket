const { Router } = require('express');
const Product = require('../models/Product');

const router = Router();
const getProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    msg: 'Listado de productos',
    products,
  });
};

const postProducts = async (req, res) => {
  const body = req.body;

  const user = new Product(body);
  const newUser = await user.save();

  res.status(201).json({
    msg: 'Producto creado exitosamente',
  });
};

router.get('/', getProducts);
router.post('/', postProducts);

module.exports = router;
