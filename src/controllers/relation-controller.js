const RelationsModel = require("../../database/models/Relations");

const getProperties = async () => {
  const relation = await RelationsModel.find();
  return relation
};

const getProperty = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const relation = await RelationsModel.find({user: id});
  return relation
};

const postProperty = async (body) => {
  try {
    const relation = new RelationsModel(body);
    const newRelation =  await relation.save();

    const relationInfo ={
      title: newRelation.title,
      type: newRelation.type,
    }

    return relationInfo
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putProperty = async (id, body) => {
  const relation = await getProperty(id);

  if (typeof relation === 'string') {
    return relation
  }

  const newRelation = await RelationsModel.findByIdAndUpdate(id, body, { new: true });
  return newRelation
};

const deleteProperty = async (id) => {
  const deleteRelation = await RelationsModel.findByIdAndDelete(id);
  return deleteRelation ? true : false;
};

module.exports = {
  getProperties,
  getProperty,
  postProperty,
  putProperty,
  deleteProperty
}
