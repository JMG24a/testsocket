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

const getProcedureByUser = async (req, res, next) => {
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

const getProcedureById = async (req, res, next) => {
  try{
    const {id} = req.params;
    const procedure = await procedureController.getProcedureById(id)

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
  const token = req.myPayload;
  try {
    const newProcedure = await procedureController.postProcedure(body, token);
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

router.get("/", validateToken, getProcedures);
router.get(
  "/user",
  passport.authenticate('jwt', {session: false}),
  validateToken,
  getProcedureByUser
);
router.get(
  "/:id",
  getProcedureById
);
router.post("/", validateToken, postProcedure);
router.put("/:id", validateToken, putProcedure);
router.delete("/:id", validateToken, deleteProcedure);

module.exports = router
