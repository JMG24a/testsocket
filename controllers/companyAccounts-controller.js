const CompanyAccountsModel = require("../models/companyAccounts");
const CompanyModel = require("../models/company");

const getCompanyAccounts = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const Accounts = await CompanyAccountsModel
    .find({idCompany: idCompany})
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
  getCompanyAccounts,
  postCompanyAccount,
  putCompanyAccount,
  deleteCompanyAccount
}
