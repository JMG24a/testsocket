const VehicleModel = require('../models/Vehicle');

const getVehicles = async () => {
  const vehicle = await VehicleModel.find().populate('userOwnerId');
  return vehicle;
};

const getVehicle = async (id) => {
  if (!id) {
    return 'La propiedad no fue encontrada';
  }
  const vehicle = await VehicleModel.find({ user: id });
  return vehicle;
};

const postVehicle = async (body) => {
  try {
    const vehicle = new VehicleModel(body);

    const newVehicle = await vehicle.save();

    const VehicleInfo = {
      title: newVehicle.title,
      type: newVehicle.type,
      id: vehicle._id,
    };

    return VehicleInfo;
  } catch (e) {
    throw new Error('El usuario no pudo ser creado');
  }
};

const putVehicle = async (id, body) => {
  const vehicle = await getProperty(id);

  if (typeof vehicle === 'string') {
    return vehicle;
  }

  const newVehicle = await VehicleModel.findByIdAndUpdate(id, body, {
    new: true,
  });
  return newVehicle;
};

const deleteVehicle = async (id) => {
  const deleteVehicle = await VehicleModel.findByIdAndDelete(id);
  return deleteVehicle ? true : false;
};

module.exports = {
  getVehicles,
  getVehicle,
  postVehicle,
  putVehicle,
  deleteVehicle,
};
