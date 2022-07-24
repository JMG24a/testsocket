const { Router } = require('express')
const vehicleController = require('../controllers/vehicle-controller')

const router = Router();

const getVehicles = async (req, res) => {
  const vehicle = await vehicleController.getVehicles()

  res.status(200).json({
    msg: "Listado de Propiedades",
    vehicle,
  });
};

const getVehicle = async (req, res) => {
  const {id} = req.params;
  const vehicle = await vehicleController.getVehicle(id)

  res.status(200).json({
    msg: "Propiedad",
    vehicle
  });
};

const postVehicle = async (req, res) => {
  const body = req.body;
  try {
    const newVehicle = await vehicleController.postVehicle(body);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      vehicle: newVehicle
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putVehicle = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newVehicle = await vehicleController.putVehicle(id, body)

    if (typeof newVehicle === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newVehicle,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteVehicle = async (req, res) => {
  const {id} = req.params;
  const isDelete = await vehicleController.deleteVehicle(id)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.post("/", postVehicle);
router.put("/:id", putVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router
