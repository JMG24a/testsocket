const CompanyOpportunitiesModel = require("../models/companyOpportunities.js");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User")

const getSearchOpportunities = async (value, token, options) => {
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

    const Opportunities = await CompanyOpportunitiesModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .limit(options.limit)
      .skip(options.offset);

    return Opportunities
  } catch (error) {
    console.log(error.message)
  }
};


const getCompanyOpportunities = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const Opportunities = await CompanyOpportunitiesModel
    .find({idCompany: idCompany})
    .limit(options.limit)
    .skip(options.offset);

  return Opportunities
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
