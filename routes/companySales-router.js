const { Router } = require('express')
const companySalesController = require('../controllers/companySales-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getCompanySales = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const sales = await companySalesController.getCompanySales(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de ventas",
      sales,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanySale = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newCompanySale = await companySalesController.postCompanySale(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newCompanySale
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanySale = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload

  try {
    const editCompanySale = await companySalesController.putCompanySale(id, body, token)

    if (typeof editCompanySale === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editCompanySale,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanySale = async (req, res) => {
  const {id, idCompany} = req.params;
  const token = req.myPayload
  const isDelete = await companySalesController.deleteCompanySale(id, token, idCompany)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

router.get("/:idCompany", validateToken, getCompanySales);
router.post("/:idCompany", validateToken, postCompanySale);
router.put("/:id",validateToken, putCompanySale);
router.delete("/:idCompany/:id", validateToken, deleteCompanySale);

module.exports = router
