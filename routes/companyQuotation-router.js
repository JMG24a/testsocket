const { Router } = require('express')
const companyQuotationController = require('../controllers/companyQuotations-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getCompanyQuotations = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const quotations = await companyQuotationController.getCompanyQuotations(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Quotationos",
      quotations,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyQuotation = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newQuotation = await companyQuotationController.postCompanyQuotation(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newQuotation
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanyQuotation = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload

  try {
    const editQuotation = await companyQuotationController.putCompanyQuotation(id, body, token)

    if (typeof editQuotation === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editQuotation,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanyQuotation = async (req, res) => {
  const {id, idCompany} = req.params;
  const token = req.myPayload
  const isDelete = await companyQuotationController.deleteCompanyQuotation(id, token, idCompany)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/:idCompany", validateToken, getCompanyQuotations);
router.post("/:idCompany", validateToken, postCompanyQuotation);
router.put("/:id",validateToken, putCompanyQuotation);
router.delete("/:idCompany/:id", validateToken, deleteCompanyQuotation);

module.exports = router
