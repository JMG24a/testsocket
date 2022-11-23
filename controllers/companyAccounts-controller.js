const CompanyAccountsModel = require("../models/companyAccounts");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User")
const { importAccountsFromXLSX } = require("../services/importAccounts");
const { uploadedAccounts } = require("../mails/uploadedAccounts");

const getSearchAccounts = async (value, token, options) => {
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

    const Accounts = await CompanyAccountsModel
      .find({
        $and: [
          {accountName: {$regex: regex, $options: 'gi'}},
          {$or: [{idCompany: user.companies},{idUser: token.sub.id}]}
        ]})
      .limit(options.limit)
      .skip(options.offset);

    return Accounts
  } catch (error) {
    console.log(error)
  }
};

const getCompanyAccounts = async (token, options) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(company.employeesId.includes(token.sub.id) === false){
      return "este usuario no es un empleado"
    }
  }

  const Accounts = await CompanyAccountsModel
    .find({$or: [{idCompany: user.companies}, {idUser: token.sub.id}]})
    .populate("contactId")
    .limit(options.limit)
    .skip(options.offset);

  return Accounts
};

const postCompanyAccount = async (body, token) => {
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        return "este usuario no es un empleado"
      }
      body.idCompany = user.companies
    }else{
      body.idUser = token.sub.id
    }

    const newAccounts = new CompanyAccountsModel(body);
    const saveObject = await newAccounts.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanyAccount = async (body, token) => {
  try {
    let result = "Error no encontrado"
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        return "este usuario no es un empleado"
      }
      const accounts = body.map(account => {
        account.idCompany = user.companies
        return account
      })
      console.log("CC",company)
      const options = { ordered: true };
      result = await CompanyAccountsModel.insertMany(accounts, options);
      await uploadedAccounts(token.sub.email)

    }else{
      const accounts = body.map(account => {
        account.idUser = token.sub.id
        return account
      })
      console.log("aC",accounts)
      const options = { ordered: true };
      result = await CompanyAccountsModel.insertMany(accounts, options);
      await uploadedAccounts(token.sub.email)
    }

    return result
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyAccount = async (id, body, token) => {
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(company.employeesId.includes(token.sub.id) === false){
        return "este usuario no es un empleado"
      }
    }

    const editCompanyAccounts = await CompanyAccountsModel.findByIdAndUpdate(id, body, { new: true });
    return editCompanyAccounts
  } catch (error) {
    console.log(error.message)
  }
};

const deleteCompanyAccount = async (id, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(company.employeesId.includes(token.sub.id) === false){
      return "este usuario no es un empleado"
    }
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
