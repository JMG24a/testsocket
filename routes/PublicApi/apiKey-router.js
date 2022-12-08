const keyController = require("../../controllers/key-controller.js")
const { Router } = require('express')

const router = Router();

const getKey = async (req, res) => {
  const token = req.myPayload
  const key = await keyController.getKey(token)

  res.status(200).json({
    ok: true,
    msg: "Listado de Articulos",
    key,
  });
};

const generateKey = async (req, res) => {
  const token = req.myPayload

  try {
    const newKey = await keyController.generateKey(token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      key: newKey
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteKey = async (req, res) => {
  const token = req.myPayload
  const isDelete = await keyController.deleteKey(token)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", validateToken, getKey);
router.post("/", validateToken, generateKey);
router.put("/", validateToken, renewKey);
router.delete("/", validateToken, deleteKey);

module.exports = router;
