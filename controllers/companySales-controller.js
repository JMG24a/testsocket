const CompanySalesModel = require("../models/companySales.js");
const CompanyAccountsModel = require("../models/companyAccounts.js")
const UserModel = require("../models/User");
const CompanyModel = require("../models/company");

const getSearchCompanySales = async (value, token, options) => {
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

    const sales = await CompanySalesModel
      .find({
        $and: [
          {$or: [{accountName: {$regex: regex, $options: 'gi'}},{accountPhone: {$regex: regex, $options: 'gi'}}]},
          {idCompany: user.companies}
        ]})
      .populate('contact')
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanySalesModel
      .find({
        $and: [
          {accountName: {$regex: regex, $options: 'gi'}},
          {$or: [{idCompany: user.companies},{idUser: token.sub.id}]}
        ]})
      .count()

    return {sales, count}
  } catch (error) {
    console.log(error)
  }
};

const getCompanySales = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const sales = await CompanySalesModel
    .find({idCompany: idCompany})
    .populate("contact")
    .limit(options.limit)
    .skip(options.offset)
    .sort({createdAt:'descending'});;

  const count = await CompanySalesModel
    .find({idCompany: idCompany})
    .count()

  return {sales,count}
};

const postCompanySale = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    // const products = await ModelProducts.

    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
    body.idCompany = idCompany
    body.saleNumber = (parseInt(company.settings.salesNumber, 10) + 1)

    const newSale = new CompanySalesModel(body);
    const saveObject = (await newSale.save()).populate('contact');

    new Promise(async(resolve, reject)=>{
      await CompanyModel.findByIdAndUpdate(idCompany,
        {
          settings: {
            ...company.settings,
            salesNumber:( parseInt(company.settings.salesNumber, 10) + 1)}
        },
        { new: true })
    })

    return saveObject
  }catch(e){
    console.log(e)
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanySales = async (body, token) => {
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
      const numberInvoice = company.settings.salesNumber;
      let invoice = parseInt(numberInvoice,10);

      const sales = body.map((sale) => {
        sale.idCompany = user.companies
        invoice = invoice + 1
        sale.saleNumber = invoice
        return sale
      })

      const options = { ordered: true };
      result = await CompanySalesModel.insertMany(sales, options);
      // await uploadedSale(token.sub.email)
    }

    return result
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanySale = async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
  }

  if(body.contact){
    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
  }

  const newSales = await CompanySalesModel.findByIdAndUpdate(id, body, { new: true }).populate('contact');
  return newSales
};

const deleteCompanySale = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanySalesModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getSearchCompanySales,
  getCompanySales,
  postCompanySale,
  importCompanySales,
  putCompanySale,
  deleteCompanySale
}
