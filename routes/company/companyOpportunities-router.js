const { Router } = require('express')
const companyOpportunitiesController = require('../../controllers/company/companyOpportunities-controller.js')
//middleware
const { validateToken } = require('../../auth/middleware/jwt');

const router = Router();

const getSearchOpportunities = async (req, res) => {
  const {value} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const {opportunities, count} = await companyOpportunitiesController.getSearchOpportunities(value, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Opportunitiesos",
      opportunities,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getCompanyOpportunities = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const {opportunities, count} = await companyOpportunitiesController.getCompanyOpportunities(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Opportunitiesos",
      opportunities,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyOpportunities = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newOpportunities = await companyOpportunitiesController.postCompanyOpportunities(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newOpportunities
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanyOpportunities = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload;

  try {
    const editOpportunities = await companyOpportunitiesController.putCompanyOpportunities(id, body, token)

    if (typeof editOpportunities === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editOpportunities,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanyOpportunities = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await companyOpportunitiesController.deleteCompanyOpportunities(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

router.get("/search/:value", validateToken, getSearchOpportunities);
router.get("/:idCompany", validateToken, getCompanyOpportunities);
router.post("/:idCompany", validateToken, postCompanyOpportunities);
router.put("/:id",validateToken, putCompanyOpportunities);
router.delete("/:id", validateToken, deleteCompanyOpportunities);

module.exports = router
