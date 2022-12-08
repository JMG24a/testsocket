const keyController = require("../../controllers/key-controller.js")
const { Router } = require('express');
const { validateToken } = require("../../auth/middleware/jwt.js");

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
    ok: isDelete,
    msg: "Eliminado con exito",
  });
};

router.get("/", validateToken, getKey);
router.post("/", validateToken, generateKey);
router.delete("/", validateToken, deleteKey);

module.exports = router;
