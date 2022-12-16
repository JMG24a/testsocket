const CompanyPurchasesModel = require("../../models/companyPurchaseOrders");
const CompanyAccountsModel = require("../../models/companyAccounts");
const CompanyModel = require("../../models/company");
const UserModel = require("../../models/User");

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

    const purchases = await CompanyPurchasesModel
      .find({ $and: [
        {$or: [{accountName: {$regex: regex, $options: 'gi'}}, {accountPhone: {$regex: regex, $options: 'gi'}}]},
        {idCompany: user.companies}
      ]})
      .populate('contact')
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyPurchasesModel
      .find({ $and: [{accountPhone: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .count()

    return {purchases, count}
  } catch (error) {
    console.log(error)
  }
};

const getCompanyPurchases = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const purchases = await CompanyPurchasesModel
    .find({idCompany: idCompany})
    .populate('contact')
    .limit(options.limit)
    .skip(options.offset)
    .sort({createdAt:'descending'});

  const count = await CompanyPurchasesModel
    .find({idCompany: idCompany})
    .count()

  return {purchases, count}
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
    body.idCompany = idCompany;
    body.purchaseNumber = (parseInt(company.settings.purchasesNumber, 10) + 1);

    const companyPurchase = new CompanyPurchasesModel(body);
    const saveObject = (await companyPurchase.save()).populate('contact');

    new Promise(async(resolve, reject)=>{
      await CompanyModel.findByIdAndUpdate(idCompany,
        {
          settings: {
            ...company.settings,
            purchasesNumber:( parseInt(company.settings.purchasesNumber, 10) + 1)}
        },
        { new: true })
    })

    return saveObject
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

  if(body.contact){
    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
  }

  const editPurchase = await CompanyPurchasesModel.findByIdAndUpdate(id, body, { new: true }).populate('contact');
  return editPurchase
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
