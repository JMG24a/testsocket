const CompanySalesModel = require("../models/companySales.js");
const CompanyAccountsModel = require("../models/companyAccounts.js")
const CompanyProductsModel = require("../models/companyProducts.js")
const UserModel = require("../models/User");
const CompanyModel = require("../models/company");
const { getDateInString } = require("../helper/getDateInString.js");
const boom = require("@hapi/boom");

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
    }else{
      throw boom.notFound("Empresa no encontrada")
    }

    const regex = new RegExp(value.replace("_", " "));

    const sales = await CompanySalesModel
      .find({
        $and: [
          {$or: [{accountName: {$regex: regex, $options: 'gi'}},{accountPhone: {$regex: regex, $options: 'gi'}}]},
          {idCompany: user.companies}
        ]})
      .populate('contact')
      .populate("idCompany")
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
  if(company !== null){
    if(!company.employeesId.includes(token.sub.id)){
      throw boom.notFound("Empresa no encontrada")
    }
  }else{
    throw boom.notFound("Empresa no encontrada")
  }

  const sales = await CompanySalesModel
    .find({idCompany: idCompany})
    .populate("contact")
    .populate("idCompany")
    .limit(options.limit)
    .skip(options.offset)
    .sort({createdAt: "desc"});

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

    /* Descontar productos */

    // const searchProducts = body.products.map(item => {
    //   return item.name
    // })

    // const processProducts = body.products.map(item => {
    //   return {name: item.name, quantity: item.unity}
    // })

    // const products = await CompanyProductsModel
    // .find({$and:[
    //   {idCompany: idCompany},
    //   {name: searchProducts}
    // ]})

    // const productsResult = products.map((item) => {
    //   processProducts.map(item2 => {
    //     if(item.name === item2.name){
    //       item.quantity = item.quantity - item2.quantity
    //     }
    //   })
    //   const data = { case: { $eq: [ "name", item.name ] }, then: item.quantity }
    //   return data
    // })

    // console.log("productsResult",productsResult)
    // console.log("----------------------- O -------------------------------")

    // const res = await CompanyProductsModel.updateMany({},{
    //   $set: { quantity: { $switch: {
    //     branches: productsResult,
    //     default: "0"
    // }}}})

    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
    body.idCompany = idCompany
    body.saleNumber = (parseInt(company.settings.salesNumber, 10) + 1)
    company.settings.salesNumber = (parseInt(company.settings.salesNumber, 10) + 1)

    const newSale = new CompanySalesModel(body);
    const saveObject = await newSale.save();

    new Promise(async(resolve, reject)=>{
      await CompanyModel.findByIdAndUpdate(idCompany,
        {
          settings: {
            ...company.settings,
            salesNumber: company.settings.salesNumber
          }
        },
        { new: true })
    })

    const resultSales = await CompanySalesModel
      .findById(saveObject.id)
      .populate("contact")
      .populate("idCompany");

    return resultSales
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

      let invoice = 0
      const accounts = []

      const sales = body.map((sale) => {
        //numero de factura
        sale.idCompany = user.companies
        invoice = sale.saleNumber

        const dateImport = new Date()
        sale.dateImport = getDateInString(dateImport)

        //cuentas
        accounts.push({
          idCompany: company.id,
          accountName: `${sale.accountName}=${company.id}`,
          nit: sale.nit,
          address: sale.direction,
          city: sale.city,
          state: sale.department,
          mobile: sale.mobile,
          email: sale.email,
          website: sale.web,
          source: sale.source,
          observations: sale.observationsAccount,
          dateImport: getDateInString(dateImport),
        })
        return {
          idCompany: company.id,
          contactName: sale.contact,
          accountName: sale.accountName,
          accountPhone: sale.mobile,
          products: sale.products,
          saleNumber: sale.saleNumber,
          date: sale.date,
          paymentMethod: sale.paymentMethod,
          seller: sale.seller,
          observations: sale.observations,
          subTotal: sale.subTotal,
          valueIva: sale.valueIva,
          sendValue: sale.sendValue,
          total: sale.total,
          dateImport: sale.dateImport
        }
      })


      if(invoice > company.settings.salesNumber){
        company.settings.salesNumber = invoice
        await CompanyModel.findByIdAndUpdate(company.id,
          {
            settings: {
              ...company.settings,
              salesNumber: company.settings.salesNumber
            }
          },
          { new: true })
      }

      const options = { ordered: false };
      result = await CompanySalesModel.insertMany(sales, options);

      const optionsAccount = { ordered: false };
      await CompanyAccountsModel.insertMany(accounts, optionsAccount);
      // await uploadedSale(token.sub.email)
    }

    return result
  }catch(e){
    console.log(e)
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

  const newSales = await CompanySalesModel.findByIdAndUpdate(id, body, { new: true })
    .populate('contact')
    .populate("idCompany");
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

const deleteImportCompanySales = async (body, token) => {
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

  const delCompanyOrder = await CompanySalesModel.deleteMany({
    $and: [
      {idCompany: body.idCompany},
      {"dateImport": {$eq : body.start}}
    ]
  });

  if(delCompanyOrder.deletedCount === 0){
    return false
  }

  return delCompanyOrder.acknowledged ? true : false;
};

module.exports = {
  getSearchCompanySales,
  getCompanySales,
  postCompanySale,
  importCompanySales,
  putCompanySale,
  deleteCompanySale,
  deleteImportCompanySales
}
