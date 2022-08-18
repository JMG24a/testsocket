const { Router } = require('express');
const passport = require('passport');
const { validateToken } = require('../auth/middleware/jwt');
const procedureController = require('../controllers/procedure-controller')

const router = Router();

const getProcedures = async (req, res) => {
  const procedure = await procedureController.getProcedures()

  res.status(200).json({
    msg: "Listado de procedimientos",
    procedure,
  });
};

const getProcedure = async (req, res) => {
  const token = req.myPayload;
  const procedure = await procedureController.getProcedure(token)

  res.status(200).json({
    msg: "procedimiento",
    procedure
  });
};

const postProcedure = async (req, res) => {
  const body = req.body;
  try {
    const newProcedure = await procedureController.postProcedure(body);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      procedure: newProcedure
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putProcedure = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newProcedure = await procedureController.putProcedure(id, body)

    if (typeof newProcedure === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newProcedure,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteProcedure = async (req, res) => {
  const {id} = req.params;
  const isDelete = await procedureController.deleteProcedure(id)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
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
