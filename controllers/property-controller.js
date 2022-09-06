const PropertyModel = require("../models/Property");
const userController = require("../controllers/user-controller");

const getProperties = async () => {
  const property = await PropertyModel.find();
  return property
};

const getProperty = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const property = await PropertyModel.find({userId: id});
  return property
};

const postProperty = async (body, token) => {
  try {
    const property = new PropertyModel(body);
    const saveObject = await property.save();

    const propertyOwners = getProperty(token.sub.id)
    const user = await userController.getUser(token.sub.id)

    user.propertiesOwned.push(saveObject._id)
    await userController.putUser(token, {propertiesOwned: user.propertiesOwned})

    return propertyOwners
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putProperty = async (id, body) => {
  const property = await getProperty(id);

  if (typeof property === 'string') {
    return property
  }

  const newProperty = await PropertyModel.findByIdAndUpdate(id, body, { new: true });
  return newProperty
};

const deleteProperty = async (id, token) => {
  let user = await userController.getUser(token.sub.id)
  user.propertiesOwned = user.propertiesOwned.filter(_id => _id === id)
  await userController.putUser(token, {propertiesOwned: user.propertiesOwned})

  const deleteProperty = await PropertyModel.findByIdAndDelete(id);

  return deleteProperty ? true : false;
};

module.exports = {
  getProperties,
  getProperty,
  postProperty,
  putProperty,
  deleteProperty
}
