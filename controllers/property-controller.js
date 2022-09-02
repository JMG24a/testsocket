const PropertyModel = require("../models/Property");

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
    await property.save();


    const propertyOwners = getProperty(token.sub.id)

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

const deleteProperty = async (id) => {
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
