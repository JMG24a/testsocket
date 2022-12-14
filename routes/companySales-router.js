const { Router } = require('express')
const companySalesController = require('../controllers/companySales-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getSearchCompanySales = async(req, res, next) => {
  const {value} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const {sales, count} = await companySalesController.getSearchCompanySales(value, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Cuentas",
      sales,
      count
    });
  }catch(e){  
    next(e);
  }
}

const getCompanySales = async (req, res, next) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const {sales, count} = await companySalesController.getCompanySales(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de ventas",
      sales,
      count
    });
  }catch(e){
    next(e);
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

const importCompanySales = async (req, res, next) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newCompanySales = await companySalesController.importCompanySales(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newCompanySales
    });
  } catch (error) {
    next(error)
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

const deleteImportCompanySales = async(req, res) => {
  const body = req.body;
  const token = req.myPayload;
  const isDelete = await companySalesController.deleteImportCompanySales(body, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
  
} 

router.get("/search/:value", validateToken, getSearchCompanySales)
router.get("/:idCompany", validateToken, getCompanySales);
router.post("/:idCompany", validateToken, postCompanySale);
router.post("/:idCompany/import", validateToken, importCompanySales)
router.put("/:id",validateToken, putCompanySale);
router.delete("/:idCompany/:id", validateToken, deleteCompanySale);
router.post("/import/del", validateToken, deleteImportCompanySales);

module.exports = router
