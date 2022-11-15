const RelationModel = require("../models/Relation");
const CompanyModel = require("../models/company");
const userController = require("../controllers/user-controller");
const { ObjectId } = require("mongodb");

const getRelations = async () => {
  const relation = await RelationModel.find();
  return relation
};

const getRelationsUser = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const relationByUser = await RelationModel.find({userId: id});
  const company = await CompanyModel.find({employeesId: id});
  let relation

  if(!company){
    relation = [
      ...relationByUser,
    ]
  }else{
    relation = [
      ...relationByUser,
      ...company[0].contacts
    ]
  }

  console.log("company", relation)
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
    const user = await userController.getUser(token.sub.id)
    const company = await CompanyModel.find({employeesId: token.sub.id});


    let RelationsOwner = []
    if(!company){
      body.userId = token.sub.id;
      const relation = new RelationModel(body);
      const saveObject = await relation.save();

      user.contacts.push(saveObject.id)
      await userController.putUser(token, {contacts: user.contacts})
      RelationsOwner = await getRelation(token.sub.id)
    }else{
      body._id = ObjectId();
      if(company[0].contacts === undefined){
        company[0].contacts = []
      }
      company[0].contacts.push(body)
      const saveObject = await CompanyModel.findByIdAndUpdate(company[0].id, {
        contacts: company[0].contacts
      }, { new: true });

      RelationsOwner = await getRelationsUser(token.sub.id)
    }

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
  let deleteRelation

  if(user.contacts.includes(id)){
    user.contacts = user.contacts.filter(_id => _id === id)
    await userController.putUser(token, {contacts: user.contacts})
    deleteRelation = await RelationModel.findByIdAndDelete(id);
  }

  let company = await CompanyModel.find({employeesId: token.sub.id});
  company[0].contacts = company[0].contacts.filter(_id => _id === id)

  return deleteRelation;
};

module.exports = {
  getRelations,
  getRelationsUser,
  getRelation,
  postRelation,
  putRelation,
  deleteRelation
}
