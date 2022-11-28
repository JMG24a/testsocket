const CompanyOpportunitiesModel = require("../models/companyOpportunities.js");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User")

const getSearchOpportunities = async (value, token, options) => {
  console.log('%cMyProject%cline:5%cvalue', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px', value)
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies);
    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }

    const regex = new RegExp(value.replace("_", " "));

    const opportunities = await CompanyOpportunitiesModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyOpportunitiesModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .count()

    return {opportunities,count}
  } catch (error) {
    console.log(error.message)
  }
};


const getCompanyOpportunities = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const opportunities = await CompanyOpportunitiesModel
    .find({idCompany: idCompany})
    .limit(options.limit)
    .skip(options.offset);

  const count = await CompanyOpportunitiesModel
    .find({idCompany: idCompany})
    .count()

  return {
    opportunities,
    count
  }
};

const postCompanyOpportunities = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const newOpportunities = new CompanyOpportunitiesModel(body);
    const saveObject = (await newOpportunities.save()).populate('contactId');

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyOpportunities = async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const editCompanyOpportunities = await CompanyOpportunitiesModel.findByIdAndUpdate(id, body, { new: true });
  return editCompanyOpportunities
};

const deleteCompanyOpportunities = async (id, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyOpportunitiesModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getSearchOpportunities,
  getCompanyOpportunities,
  postCompanyOpportunities,
  putCompanyOpportunities,
  deleteCompanyOpportunities
}
