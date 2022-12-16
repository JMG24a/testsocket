const boom = require('@hapi/boom');
const { Router } = require('express');
const passport = require('passport');
const { validateToken } = require('../auth/middleware/jwt');
const procedureController = require('../controllers/procedure-controller')

const router = Router();

const getProcedures = async (req, res, next) => {
  try{
    const procedure = await procedureController.getProcedures()
    res.status(200).json({
      ok: true,
      msg: "Listado de procedimientos",
      procedure,
    });
  }catch(e){
    next(e)
  }
};

const getProcedure = async (req, res, next) => {
  try{
    const token = req.myPayload;
    const procedure = await procedureController.getProcedureByUser(token)
  
    res.status(200).json({
      ok: true,
      msg: "Procedimiento encontrado",
      procedure
    });
  }catch(e){
    next(e)
  }
};

const postProcedure = async (req, res, next) => {
  const body = req.body;
  try {
    const newProcedure = await procedureController.postProcedure(body);
    res.status(201).json({
      ok: true,
      msg: "Procedimiento creado",
      procedure: newProcedure
    });
  } catch (error) {
    next(error)
  }
};

const putProcedure = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newProcedure = await procedureController.putProcedure(id, body)

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newProcedure,
    });
  } catch (error) {
    next(error)
  }
};

const deleteProcedure = async (req, res, next) => {
  try{
    const {id} = req.params;
    await procedureController.deleteProcedure(id)
  
    res.status(200).json({
      ok: true,
      msg: "Eliminado con exito",
    });
  }catch(e){
    next(e)
  }
};

router.get("/", getProcedures);
router.get(
  "/user",
  passport.authenticate('jwt', {session: false}),
  validateToken,
  getProcedure
);
router.post("/", postProcedure);
router.put("/:id", putProcedure);
router.delete("/:id", deleteProcedure);

module.exports = router
