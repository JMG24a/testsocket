const { Router } = require('express')
const companyProductController = require('../controllers/companyProducts-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getSearchProducts = async (req, res) => {
  const {value} = req.params;
  const options = req.query;
  const token = req.myPayload;
  console.log('%cMyProject%cline:11%ctoken', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px', token)

  try{
    const {products, count} = await companyProductController.getSearchProducts(value, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de productos",
      products,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getCompanyProducts = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const {products, count} = await companyProductController.getCompanyProducts(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de productos",
      products,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyProduct = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newProduct = await companyProductController.postCompanyProduct(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newProduct
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanyProduct = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload

  try {
    const editProduct = await companyProductController.putCompanyProduct(id, body, token)
    if (typeof editProduct === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editProduct,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanyProduct = async (req, res) => {
  const {id, idCompany} = req.params;
  const token = req.myPayload
  const isDelete = await companyProductController.deleteCompanyProduct(id, token, idCompany)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

router.get("/search/:value", validateToken, getSearchProducts);
router.get("/:idCompany", validateToken, getCompanyProducts);
router.post("/:idCompany", validateToken, postCompanyProduct);
router.put("/:id",validateToken, putCompanyProduct);
router.delete("/:idCompany/:id", validateToken, deleteCompanyProduct);

module.exports = router
