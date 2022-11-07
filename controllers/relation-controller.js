const RelationModel = require("../models/Relation");
const userController = require("../controllers/user-controller");

const getRelations = async () => {
  const relation = await RelationModel.find();
  return relation
};

const getRelationsUser = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const relation = await RelationModel.find({userId: id});
  return relation
};

const getRelation = async (id, idRelation) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const relation = await RelationModel.find({userId: id, id: idRelation});
  return relation
};

const postRelation = async (body, token) => {
  try {
    body.userId = token.sub.id;
    const relation = new RelationModel(body);
    const saveObject = await relation.save();

    const user = await userController.getUser(token.sub.id)
    user.contacts.push(saveObject.id)

    await userController.putUser(token, {contacts: user.contacts})

    const RelationsOwner = await getRelation(token.sub.id)

    return RelationsOwner
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putRelation= async (id, body) => {
  const relation = await getRelation(id);

  if (typeof relation === 'string') {
    return relation
  }

  const newRelation = await RelationModel.findByIdAndUpdate(id, body, { new: true });
  return newRelation
};

const deleteRelation = async (id, token) => {
  let user = await userController.getUser(token.sub.id)
  user.contacts = user.contacts.filter(_id => _id === id)
  await userController.putUser(token, {contacts: user.contacts})

  const deleteRelation = await RelationModel.findByIdAndDelete(id);
  return deleteRelation ? true : false;
};

module.exports = {
  getRelations,
  getRelationsUser,
  getRelation,
  postRelation,
  putRelation,
  deleteRelation
}
