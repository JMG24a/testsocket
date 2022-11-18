const { Router } = require('express')
const companyOrdersController = require('../controllers/companyOrders-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getCompanyOrders = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload
  try{
    const orders = await companyOrdersController.getCompanyOrders(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de ordenes",
      orders,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyOrder = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newCompanyOrder = await companyOrdersController.postCompanyOrder(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      companyOrder: newCompanyOrder
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanyOrder = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload

  try {
    const editCompanyOrder = await companyOrdersController.putCompanyOrder(id, body, token)

    if (typeof editCompanyOrder === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editCompanyOrder,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanyOrder = async (req, res) => {
  const {id, idCompany} = req.params;
  const token = req.myPayload
  const isDelete = await companyOrdersController.deleteCompanyOrder(id, token, idCompany)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

router.get("/:idCompany", validateToken, getCompanyOrders);
router.post("/:idCompany", validateToken, postCompanyOrder);
router.put("/:id",validateToken, putCompanyOrder);
router.delete("/:idCompany/:id", validateToken, deleteCompanyOrder);

module.exports = router;
