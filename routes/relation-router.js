const { Router } = require('express')
const relationsController = require('../controllers/relation-controller')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getRelations = async (req, res) => {
  const relation = await relationsController.getRelations()

  res.status(200).json({
    msg: "Listado de relaciones",
    relation,
  });
};

const getRelation = async (req, res) => {
  const token = req.myPayload
  try{
    const relation = await relationsController.getRelation(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      relation
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postRelation = async (req, res) => {
  const token = req.myPayload
  const body = req.body;
  try {
    const newRelation = await relationsController.postRelation(body, token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      relation: newRelation
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putRelation = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newRelation = await relationsController.putRelation(id, body)

    if (typeof newRelation === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newRelation,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteRelation = async (req, res) => {
  const {id} = req.params;
  const isDelete = await relationsController.deleteRelation(id)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", getRelations);
router.get("/user", validateToken, getRelation);
router.post("/", validateToken, postRelation);
router.put("/:id", putRelation);
router.delete("/:id", deleteRelation);

module.exports = router
