const CompanyPurchasesModel = require("../models/companyPurchaseOrders");
const CompanyAccountsModel = require("../models/companyAccounts");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User");

const getSearchPurchases = async (value, token, options) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }
  try {
    const regex = new RegExp(value.replace("_", " ")); //query

    const Purchases = await CompanyPurchasesModel
      .find({ $and: [{accountPhone: {$regex: regex, $options: 'gi'}},{id: user.companies}]})
      .populate('contact')
      .limit(options.limit)
      .skip(options.offset);

    return Purchases
  } catch (error) {
    console.log(error)
  }
};

const getCompanyPurchases = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const Purchases = await CompanyPurchasesModel
    .find({idCompany: idCompany})
    .populate('contact')
    .limit(options.limit)
    .skip(options.offset);

  return Purchases
};

const postCompanyPurchaseOrder = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
    body.idCompany = idCompany

    const companyPurchase = new CompanyPurchasesModel(body);
    const saveObject = await companyPurchase.save();

    const newPurchase = await CompanyPurchasesModel.findById(saveObject._id).populate('contact')
    return newPurchase
  }catch(e){
    console.log(e)
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyPurchase = async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  await CompanyPurchasesModel.findByIdAndUpdate(id, body, { new: true });

  const PurchasePopulate = await CompanyPurchasesModel.findById(id).populate('contact')
  return PurchasePopulate
};

const deleteCompanyPurchaseOrder = async (id, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyPurchase = await CompanyPurchasesModel.findByIdAndDelete(id);
  return delCompanyPurchase ? true : false;
};

module.exports = {
  getSearchPurchases,
  getCompanyPurchases,
  postCompanyPurchaseOrder,
  putCompanyPurchase,
  deleteCompanyPurchaseOrder
}
