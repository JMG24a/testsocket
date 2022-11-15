const { Router } = require('express')
const companyAccountController = require('../controllers/companyAccounts-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getCompanyAccounts = async (req, res) => {
  const {idCompany} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const accounts = await companyAccountController.getCompanyAccounts(idCompany, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Accountos",
      accounts,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyAccount = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newAccount = await companyAccountController.postCompanyAccount(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newAccount
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompanyAccount = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const token = req.myPayload

  try {
    const editAccount = await companyAccountController.putCompanyAccount(id, body, token)

    if (typeof editAccount === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      editAccount,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompanyAccount = async (req, res) => {
  const {id, idCompany} = req.params;
  const token = req.myPayload
  const isDelete = await companyAccountController.deleteCompanyAccount(id, token, idCompany)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/:idCompany", validateToken, getCompanyAccounts);
router.post("/:idCompany", validateToken, postCompanyAccount);
router.put("/:id",validateToken, putCompanyAccount);
router.delete("/:idCompany/:id", validateToken, deleteCompanyAccount);

module.exports = router
