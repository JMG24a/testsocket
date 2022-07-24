const VehicleModel = require("../../database/models/Vehicles");

const getProperties = async () => {
  const vehicle = await VehicleModel.find();
  return vehicle
};

const getProperty = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const vehicle = await VehicleModel.find({user: id});
  return vehicle
};

const postProperty = async (body) => {
  try {
    const vehicle = new VehicleModel(body);
    const newVehicle =  await vehicle.save();

    const VehicleInfo ={
      title: newVehicle.title,
      type: newVehicle.type,
    }

    return VehicleInfo
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putProperty = async (id, body) => {
  const vehicle = await getProperty(id);

  if (typeof vehicle === 'string') {
    return vehicle
  }

  const newVehicle = await VehicleModel.findByIdAndUpdate(id, body, { new: true });
  return newVehicle
};

const deleteProperty = async (id) => {
  const deleteVehicle = await VehicleModel.findByIdAndDelete(id);
  return deleteVehicle ? true : false;
};

module.exports = {
  getProperties,
  getProperty,
  postProperty,
  putProperty,
  deleteProperty
}
