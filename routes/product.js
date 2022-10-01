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

  const newProduct = new Product(body);
  await newProduct.save();

  res.status(201).json({
    ok: true,
    msg: 'Producto creado exitosamente',
    product: newProduct
  });
};

const putProducts = async (req, res) => {
  const {id} = req.params;
  const body = req.body;
  try {
    const updateProduct = await Product.findByIdAndUpdate(id, body, { new: true })

    res.status(201).json({
      ok: true,
      msg: 'Products Actializado',
      result: updateProduct
    });
  } catch {
    console.log('error');
  }
};

const delProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id)

    res.status(201).json({
      ok: true,
      msg: 'Products Eliminado',
      result: deleteProduct
    });
  } catch {
    console.log('error');
  }
};

router.get('/', getProducts);
router.post('/', postProducts);
router.put('/:id', putProducts);
router.delete('/:id', delProducts);

module.exports = router;
