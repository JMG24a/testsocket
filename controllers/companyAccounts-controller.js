const CompanyAccountsModel = require("../models/companyAccounts");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User")
const { uploadedAccounts } = require("../mails/uploadedAccounts");
const { getDateInString } = require("../helper/getDateInString");

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

    const accounts = await CompanyAccountsModel
      .find({
        $and: [
          {$or: [{accountName: {$regex: regex, $options: 'gi'}},{mobile: {$regex: regex, $options: 'gi'}}]},
          {$or: [{idCompany: user.companies},{idUser: token.sub.id}]}
        ]})
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyAccountsModel
      .find({
        $and: [
          {accountName: {$regex: regex, $options: 'gi'}},
          {$or: [{idCompany: user.companies},{idUser: token.sub.id}]}
        ]})
      .count()

    return {accounts, count}
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

  const accounts = await CompanyAccountsModel
    .find({$or: [{idCompany: user.companies}, {idUser: token.sub.id}]})
    .populate("contactId")
    .limit(options.limit)
    .skip(options.offset)
    .sort({createdAt:'descending'});

    const count = await CompanyAccountsModel
    .find({$or: [{idCompany: user.companies}, {idUser: token.sub.id}]})
    .count()

  return {
    accounts,
    count
  }
};

const getCompanyAccountsById = async (token, id) => {
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
    .findById(id)
    .populate("contactId")

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
  console.time();
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
        const dateImport = new Date()
        account.dateImport = getDateInString(dateImport)
        return account
      })
      const options = { ordered: false };
      result = await CompanyAccountsModel.insertMany(accounts, options);
      await uploadedAccounts(token.sub.email)

    }else{
      const accounts = body.map(account => {
        account.idUser = token.sub.id
        account.dateImport = new Date()
        account.dateImport = getDateInString(dateImport)
        return account
      })
      const options = { ordered: false };
      result = await CompanyAccountsModel.insertMany(accounts, options);
      await uploadedAccounts(token.sub.email)
    }
    console.timeEnd();
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

const deleteImportCompanyAccount = async (body, token) => {

  const user = await UserModel.findById(body.id)
  if(!user){
    return "este no es un usuario"
  }
  body.idCompany = user.id

  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(!company.employeesId.includes(body.id) || !company.userId.includes(body.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = company.id
  }

  const delCompanyOrder = await CompanyAccountsModel.deleteMany({
    $and: [
      {$or:[
        {idUser: body.id},
        {idCompany: body.idCompany}
      ]},
      {"dateImport": {$eq : body.start}}
    ]
  });

  if(delCompanyOrder.deletedCount === 0){
    return false
  }

  return delCompanyOrder.acknowledged ? true : false;
};

module.exports = {
  getSearchAccounts,
  getCompanyAccounts,
  getCompanyAccountsById,
  postCompanyAccount,
  importCompanyAccount,
  putCompanyAccount,
  deleteCompanyAccount,
  deleteImportCompanyAccount
}
