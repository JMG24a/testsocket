const RelationModel = require("../models/Relation");
const UserModel = require("../models/User");
const CompanyModel = require("../models/company");
const userController = require("../controllers/user-controller");
const { ObjectId } = require("mongodb");

const getSearchRelations = async (value, token, options) => {
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies);
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        return "este usuario no es un empleado"
      }
    }

    const regex = new RegExp(value.replace("_", " "));

    const relations = await RelationModel
      .find({
        $and: [
          {name: {$regex: regex, $options: 'gi'}},
          {$or: [{companyId: user.companies},{userId: token.sub.id}]}
        ]})
      .limit(options.limit)
      .skip(options.offset);

    return relations
  } catch (error) {
    console.log(error)
  }
};

const getRelations = async () => {
  const relation = await RelationModel.find();
  return relation
};

const getRelationsUser = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }

  const user = await userController.getUser(id)

  const relationByUser = await RelationModel.find({userId: id});
  const relationByCompany = await RelationModel.find({companyId: user.companies[0]._id});

  const relation = [
    ...relationByUser,
    ...relationByCompany
  ]

  return relation
};

const getRelationsCompany = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }

  const user = await userController.getUser(id)
  const relationByCompany = await RelationModel.find({companyId: user.companies[0]._id});

  const relation = [
    ...relationByCompany
  ]

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
    let RelationsOwner
    const user = await userController.getUser(token.sub.id)
    if(user.companies[0]._id){
      body.companyId = user.companies[0]._id;
      const relation = new RelationModel(body);
      const saveObject = await relation.save();

      RelationsOwner = await getRelationsCompany(token.sub.id)
    }else{
      body.userId = token.sub.id;
      const relation = new RelationModel(body);
      const saveObject = await relation.save();

      user.contacts.push(saveObject.id)

      await userController.putUser(token, {contacts: user.contacts})

      RelationsOwner = await getRelation(token.sub.id)
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
  }else{
    deleteRelation = await RelationModel.findByIdAndDelete(id);
  }

  return deleteRelation;
};

module.exports = {
  getSearchRelations,
  getRelations,
  getRelationsUser,
  getRelationsCompany,
  getRelation,
  postRelation,
  putRelation,
  deleteRelation
}
