const { Router } = require('express')
const companyPurchaseOrdersController = require('../controllers/company/companyPurchaseOrders-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getSearchPurchases = async (req, res) => {
  const {value} = req.params;
  const options = req.query;
  const token = req.myPayload
  try{
    const {purchases, count} = await companyPurchaseOrdersController.getSearchPurchases(value, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de ordenes",
      purchases,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getCompanyPurchases = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload
  try{
    const {purchases, count} = await companyPurchaseOrdersController.getCompanyPurchases(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de ordenes",
      purchases,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyPurchaseOrder = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newCompanyPurchaseOrder = await companyPurchaseOrdersController.postCompanyPurchaseOrder(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newPurchase: newCompanyPurchaseOrder
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanyPurchase = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload

  try {
    const editCompanyPurchaseOrder = await companyPurchaseOrdersController.putCompanyPurchase(id, body, token)

    if (typeof editCompanyPurchaseOrder === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editPurchase: editCompanyPurchaseOrder,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanyPurchaseOrder = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await companyPurchaseOrdersController.deleteCompanyPurchaseOrder(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

router.get("/search/:value", validateToken, getSearchPurchases);
router.get("/:idCompany", validateToken, getCompanyPurchases);
router.post("/:idCompany", validateToken, postCompanyPurchaseOrder);
router.put("/:id",validateToken, putCompanyPurchase);
router.delete("/:id", validateToken, deleteCompanyPurchaseOrder);

module.exports = router;
