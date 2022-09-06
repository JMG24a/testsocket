const { Router } = require('express')
const propertyController = require('../controllers/property-controller')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getProperties = async (req, res) => {
  const property = await propertyController.getProperties()

  res.status(200).json({
    ok: true,
    msg: "Listado de Propiedades",
    property,
  });
};

const getProperty = async (req, res) => {
  const token = req.myPayload
  try{
    const property = await propertyController.getProperty(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      property
    });
  }catch(e){
    res.status(200).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postProperty = async (req, res) => {
  const token = req.myPayload
  const body = req.body;
  try {
    const newProperty = await propertyController.postProperty(body, token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      property: newProperty
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putProperty = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newProperty = await propertyController.putProperty(id, body)

    if (typeof newProperty === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newProperty,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteProperty = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await propertyController.deleteProperty(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", getProperties);
router.get("/user", validateToken, getProperty);
router.post("/", validateToken, postProperty);
router.put("/:id", putProperty);
router.delete("/:id", validateToken, deleteProperty);

module.exports = router
