const CompanyAccountsModel = require("../models/companyAccounts");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User")
const { importAccountsFromXLSX } = require("../services/importAccounts")

const getSearchAccounts = async (value, token, options) => {
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

    const Accounts = await CompanyAccountsModel
      .find({$and: [{accountName: {$regex: regex, $options: 'gi'}},{id: user.companies}]})
      .limit(options.limit)
      .skip(options.offset);

    return Accounts
  } catch (error) {
    console.log(error)
  }
};

const getCompanyAccounts = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const Accounts = await CompanyAccountsModel
    .find({idCompany: idCompany})
    .populate("contactId")
    .limit(options.limit)
    .skip(options.offset);

  return Accounts
};

const postCompanyAccount = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const newAccounts = new CompanyAccountsModel(body);
    const saveObject = await newAccounts.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanyAccount = async (body, token, idCompany) => {
  console.log('%cMyProject%cline:63%cbody', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px', body)
  try {
    return "cargando documento"
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyAccount = async (id, body, token) => {

  const company = await CompanyModel.findById(body.idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const editCompanyAccounts = await CompanyAccountsModel.findByIdAndUpdate(id, body, { new: true });
  return editCompanyAccounts
};

const deleteCompanyAccount = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyAccountsModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getSearchAccounts,
  getCompanyAccounts,
  postCompanyAccount,
  importCompanyAccount,
  putCompanyAccount,
  deleteCompanyAccount
}
