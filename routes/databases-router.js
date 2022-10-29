const { Router } = require('express')
const databaseController = require('../controllers/database-controller.js')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getDatabases = async (req, res) => {
  const databases = await databaseController.getDatabases()

  res.status(200).json({
    ok: true,
    msg: "Listado de Propiedades",
    databases,
  });
};

const getDatabase = async (req, res) => {
  const token = req.myPayload
  try{
    const database = await databaseController.getDatabase(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      database
    });
  }catch(e){
    res.status(200).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postDatabase = async (req, res) => {
  const token = req.myPayload
  const body = req.body;
  try {
    const newDatabase = await databaseController.postDatabase(body, token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      database: newDatabase
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putDataBase = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const UpdateDatabase = await databaseController.putDataBase(id, body)

    if (typeof UpdateDatabase === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      UpdateDatabase,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteDatabase = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await databaseController.deleteDatabase(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", getDatabases);
router.get("/user", validateToken, getDatabase);
router.post("/", validateToken, postDatabase);
router.put("/:id", putDataBase);
router.delete("/:id", validateToken, deleteDatabase);

module.exports = router
