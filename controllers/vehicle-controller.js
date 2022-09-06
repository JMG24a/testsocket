const VehicleModel = require('../models/Vehicle');
const userController = require("../controllers/user-controller");

const getVehicles = async () => {
  const vehicle = await VehicleModel.find();
  return vehicle;
};

const getVehicle = async (id) => {
  if (!id) {
    return 'La propiedad no fue encontrada';
  }
  const vehicle = await VehicleModel.find({ userOwnerId: id });
  return vehicle;
};

const getVehicleById = async (id) => {
  if (!id) {
    return 'La propiedad no fue encontrada';
  }
  const vehicle = await VehicleModel.findById(id);
  return vehicle;
};

const postVehicle = async (body, token) => {
  try {
    const vehicle = new VehicleModel(body);
    const saveObject = await vehicle.save();

    const vehiclesOwnedAll = getVehicle(token.sub.id)
    const user = await userController.getUser(token.sub.id)

    user.vehiclesOwned.push(saveObject._id)
    await userController.putUser(token, {vehiclesOwned: user.vehiclesOwned})

    return vehiclesOwnedAll;
  } catch (e) {
    throw new Error('El usuario no pudo ser creado');
  }
};

const putVehicle = async (id, body) => {
  const vehicle = await getVehicleById(id);

  if (typeof vehicle === 'string') {
    return vehicle;
  }

  const newVehicle = await VehicleModel.findByIdAndUpdate(id, body, { new: true });
  return newVehicle;
};

const deleteVehicle = async (id, token) => {
  let user = await userController.getUser(token.sub.id)
  user.vehiclesOwned = user.vehiclesOwned.filter(_id => _id === id)
  await userController.putUser(token, {vehiclesOwned: user.vehiclesOwned})

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
