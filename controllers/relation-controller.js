const RelationModel = require("..//models/Relation");

const getRelations = async () => {
  const relation = await RelationModel.find();
  return relation
};

const getRelation = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const relation = await RelationModel.find({userId: id});
  return relation
};

const postRelation = async (body) => {
  try {
    const relation = new RelationModel(body);
    await relation.save();

    const RelationsOwner = getRelation(token.sub.id)

    return RelationsOwner
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putRelation= async (id, body) => {
  const relation = await getProperty(id);

  if (typeof relation === 'string') {
    return relation
  }

  const newRelation = await RelationModel.findByIdAndUpdate(id, body, { new: true });
  return newRelation
};

const deleteRelation = async (id) => {
  const deleteRelation = await RelationModel.findByIdAndDelete(id);
  return deleteRelation ? true : false;
};

module.exports = {
  getRelations,
  getRelation,
  postRelation,
  putRelation,
  deleteRelation
}
