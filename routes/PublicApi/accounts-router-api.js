const { Router } = require('express')
const companyAccountController = require('../../controllers/publicApi/account-controller-api')
//middleware

const router = Router();

const getAccounts = async (req, res, next) => {
  const { key } = req.params;
  try{
    const accounts = await companyAccountController.getAccounts(key)

    res.status(200).json({
      ok: true,
      msg: "Listado de Accountos",
      accounts,
    });
  }catch(e){
    next(e)
  }
};

const getAccountsById = async (req, res, next) => {
  const { id, key } = req.params;
  try{
    const accounts = await companyAccountController.getAccountsById(key, id)

    res.status(200).json({
      ok: true,
      msg: "Listado de Accountos",
      accounts,
    });
  }catch(e){
    next(e)
  }
};

const postAccount = async (req, res, next) => {
    const {key} = req.params;
    const body = req.body;

  try {
    const newAccount = await companyAccountController.postAccount(body, key);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      newAccount
    });
  } catch (e) {
    next(e)
  }
};

const putAccount = async (req, res, next) => {
  const { id, key } = req.params;
  const body = req.body;

  try {
    const editAccount = await companyAccountController.putAccount(id, body, key)

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
  } catch (e) {
    next(e)
  }
};

const deleteAccount = async (req, res, next) => {
  try{
    const {id, key} = req.params;
    const isDelete = await companyAccountController.deleteAccount(id, key)
  
    res.status(200).json({
      msg: "Eliminado con exito",
      ok: isDelete
    });
  }catch(e){
    next(e)
  }
};


router.get("/:key", getAccounts);
router.get("/:key/:id", getAccountsById);
router.post("/:key", postAccount);
router.put("/:key/:id", putAccount);
router.delete("/:key/:id", deleteAccount);

module.exports = router