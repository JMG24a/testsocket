const { Router } = require('express')
const companyAccountController = require('../controllers/companyAccounts-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getSearchAccounts = async (req, res) => {
  const {value} = req.params;
  const options = req.query;
  const token = req.myPayload;
  try{
    const {accounts, count} = await companyAccountController.getSearchAccounts(value, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Cuentas",
      accounts,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const getCompanyAccounts = async (req, res) => {
  const options = req.query;
  const token = req.myPayload;
  try{
    const { accounts, count } = await companyAccountController.getCompanyAccounts(token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de cuentas",
      accounts,
      count
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getCompanyAccountByName = async (req, res, next) => {
  const token = req.myPayload;
  const { name } = req.params
  try{
    const account = await companyAccountController.getCompanyAccountByName(token, name)

    res.status(200).json({
      ok: true,
      msg: "Listado de cuentas",
      account,
    });
  }catch(e){
    next(e)
  }
};


const getCompanyAccountsById = async (req, res) => {
  const token = req.myPayload;
  const {id} = req.params
  try{
    const accounts = await companyAccountController.getCompanyAccountsById(token, id)

    res.status(200).json({
      ok: true,
      msg: "Listado de cuentas",
      accounts,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompanyAccount = async (req, res, next) => {
  const token = req.myPayload
  const body = req.body;

  try {
    const newAccount = await companyAccountController.postCompanyAccount(body, token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newAccount
    });
  } catch (error) {
    next(error)
  }
};

const importCompanyAccount = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload
  const body = req.body;

  try {
    const newAccounts = await companyAccountController.importCompanyAccount(body, token, idCompany);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newAccounts
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
}

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
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await companyAccountController.deleteCompanyAccount(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

const deleteImportCompanyAccount = async (req, res) => {
  const body = req.body;
  const token = req.myPayload;
  const isDelete = await companyAccountController.deleteImportCompanyAccount(body, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};

router.get("/search/:value", validateToken, getSearchAccounts);
router.get("/oneByName/:name", validateToken, getCompanyAccountByName);
router.get("/", validateToken, getCompanyAccounts);
router.get("/:id", validateToken, getCompanyAccountsById);
router.post("/import", validateToken, importCompanyAccount)
router.post("/", validateToken, postCompanyAccount);
router.put("/:id", validateToken, putCompanyAccount);
router.delete("/:id", validateToken, deleteCompanyAccount);
router.post("/import/del", validateToken, deleteImportCompanyAccount);

module.exports = router
