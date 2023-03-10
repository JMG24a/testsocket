const CompanyQuotationsModel = require("../../models/company/companyQuotations.js");
const CompanyAccountsModel = require("../../models/company/companyAccounts")
const CompanyModel = require("../../models/company/company");
const UserModel = require("../../models/User");

const getSearchCompanyQuotations = async (value, token, options) => {
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

    const quotations = await CompanyQuotationsModel
      .find({
        $and: [
          {$or: [{accountName: {$regex: regex, $options: 'gi'}}, {accountPhone: {$regex: regex, $options: 'gi'}}]},
          {idCompany: user.companies}
        ]})
      .populate('contact')
      .populate('idCompany')
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyQuotationsModel
      .find({
        $and: [
          {$or: [{accountName: {$regex: regex, $options: 'gi'}}, {accountPhone: {$regex: regex, $options: 'gi'}}]},
          {$or: [{idCompany: user.companies},{idUser: token.sub.id}]}
        ]
      })
      .count()

    return {quotations, count}
  } catch (error) {
    console.log(error)
  }
};

const getCompanyQuotations = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const quotations = await CompanyQuotationsModel
    .find({idCompany: idCompany})
    .populate('contact')
    .populate('idCompany')
    .limit(options.limit)
    .skip(options.offset)
    .sort({createdAt:'descending'});

  const count = await CompanyQuotationsModel
    .find({idCompany: idCompany})
    .count()

  return {quotations, count}
};

const postCompanyQuotation = async (body, token, idCompany) => {
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
    body.quotationNumber = (parseInt(company.settings.quotationsNumber, 10) + 1)
    company.settings.quotationsNumber = (parseInt(company.settings.quotationsNumber, 10) + 1)

    const newQuotations = new CompanyQuotationsModel(body);
    const saveObject = await newQuotations.save()

    new Promise(async(resolve, reject)=>{
      await CompanyModel.findByIdAndUpdate(idCompany,
        {
          settings: {
            ...company.settings,
            quotationsNumber: company.settings.quotationsNumber
          }
        },
        { new: true })
    })

    const resultQuotations = await CompanyQuotationsModel
    .findById(saveObject._id)
    .populate('contact')
    .populate('idCompany')

    return resultQuotations
  }catch(e){
    console.log(e)
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyQuotation = async (id, body, token) => {
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

  const editQuotation = await CompanyQuotationsModel.findByIdAndUpdate(id, body, { new: true })
    .populate('contact')
    .populate('idCompany');

  return editQuotation
};

const deleteCompanyQuotation = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyQuotationsModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getSearchCompanyQuotations,
  getCompanyQuotations,
  postCompanyQuotation,
  putCompanyQuotation,
  deleteCompanyQuotation
}
