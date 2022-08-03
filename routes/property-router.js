const { Router } = require('express')
const propertyController = require('../controllers/property-controller')

const router = Router();

const getProperties = async (req, res) => {
  const property = await propertyController.getProperties()

  res.status(200).json({
    msg: "Listado de Propiedades",
    property,
  });
};

const getProperty = async (req, res) => {
  const {id} = req.params;
  const property = await propertyController.getProperty(id)

  res.status(200).json({
    msg: "Propiedad",
    property
  });
};

const postProperty = async (req, res) => {
  const body = req.body;
  try {
    const newProperty = await propertyController.postProperty(body);
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
  const isDelete = await propertyController.deleteProperty(id)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", postProperty);
router.put("/:id", putProperty);
router.delete("/:id", deleteProperty);

module.exports = router
