const CompanyAccountsModel = require("../../models/company/companyAccounts");
const CompanySalesModel = require("../../models/company/companySales");
const CompanyOrdersModel = require("../../models/company/companyOrders");
const CompanyPurchasesModel = require("../../models/company/companyPurchaseOrders");
const CompanyQuotationsModel = require("../../models/company/companyQuotations")
const CompanyModel = require("../../models/company/company");
const UserModel = require("../../models/User")
const { uploadedAccounts } = require("../../mails/uploadedAccounts");
const { getDateInString } = require("../../helper/getDateInString");
const boom = require("@hapi/boom")

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
    .count({$or: [{idCompany: user.companies}, {idUser: token.sub.id}]})

  return {
    accounts,
    count
  }
};

const getCompanyAccountByName = async (token, name) => {
  try{
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      throw boom.notFound("Este no es un usuario")
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(company.employeesId.includes(token.sub.id) === false){
        throw boom.conflict("Este usuario no es un empleado")
      }
    }
    const regex = /_/ig;
    const queries = name.replace(regex, ' ');

    const account = await CompanyAccountsModel
      .findOne({accountName: queries, idCompany: company.id})
      .populate("contactId")

    if(!account){throw boom.notFound("Esta cuenta no existe")}

    return account
  }catch(e){
    throw boom.badRequest("No se logro encontrar esta cuenta")
  }
};

const getCompanyAccountsById = async (token, id) => {
  try{
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      throw boom.notFound("este no es un usuario")
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(company.employeesId.includes(token.sub.id) === false){
        throw boom.conflict("este usuario no es un empleado")
      }
    }

    const account = await CompanyAccountsModel
      .findById(id)
      .populate("contactId")

    return account
  }catch(e){
    throw boom.badRequest("No se logro obtener la cuenta")
  }
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
    if(e.code === 11000){
      throw boom.conflict('este usuario ya existe')
    }
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanyAccount = async (body, token) => {
  console.time();
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      throw boom.notFound("este no es un usuario")
    }

    let validatorImport = {}
    const accounts = []
    const queryAccounts = []

    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        throw boom.conflict("este usuario no es un empleado")
      }
        body.map((account) => {
          account.idCompany = user.companies
          const dateImport = new Date()
          account.dateImport = getDateInString(dateImport)

          if(validatorImport[account.customerId] === undefined){
            queryAccounts.push(account.customerId)
            validatorImport[account.customerId] = {
              idCompany: company.id,
              accountName: account.accountName,
              nit: account.nit,
              address: account.address,
              city: account.city,
              state: account.state,
              mobile: account.mobile,
              email: account.email,
              website: account.website,
              source: account.source,
              observations: account.observations,
              dateImport: account.dateImport,
              customerId: account.customerId,
            }
          }
        })

      const dbAccounts = await CompanyAccountsModel.find({
        $and: [
          {idCompany: user.companies},
          {customerId: queryAccounts}
        ]
      });

      dbAccounts.map((db) => {
        if(db.customerId == validatorImport[db.customerId].customerId){
          delete(validatorImport[db.customerId])
        }
      })


      Object.keys(validatorImport).map(item => {
        accounts.push(validatorImport[item])
      })

      const options = { ordered: false };
      CompanyAccountsModel.insertMany(accounts, options);
      uploadedAccounts(token.sub.email)
    }else{
      body.map(account => {
        account.idUser = token.sub.id
        account.dateImport = new Date()
        account.dateImport = getDateInString(dateImport)

        if(validatorImport[account.customerId] === undefined){
          queryAccounts.push(account.customerId)
          validatorImport[account.customerId] = {
            idUser: token.sub.id,
            accountName: account.accountName,
            nit: account.nit,
            address: account.address,
            city: account.city,
            state: account.state,
            mobile: account.mobile,
            email: account.email,
            website: account.website,
            source: account.source,
            observations: account.observations,
            dateImport: account.dateImport,
            customerId: account.customerId,
          }
        }

      })

      const dbAccounts = await CompanyAccountsModel.find({
        $and: [
          {idUser: token.sub.id},
          {customerId: queryAccounts}
        ]
      });

      dbAccounts.map((db) => {
        if(db.customerId == validatorImport[db.customerId].customerId){
          delete(validatorImport[db.customerId])
        }
      })


      Object.keys(validatorImport).map(item => {
        accounts.push(validatorImport[item])
      })

      const options = { ordered: false };
      result = await CompanyAccountsModel.insertMany(accounts, options);
      uploadedAccounts(token.sub.email)
    }
    console.timeEnd();
    return "solicitud Enviada"
  }catch(e){
    console.log(e)
    throw boom.conflict('El import no pudo ser procesado')
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

      const account = await CompanyAccountsModel.findById(id);

      await CompanySalesModel.updateMany({
        $and: [
          {idCompany: account.idCompany},
          {accountName: account.accountName},
        ]
      },{$set:{accountName: account.accountName, accountPhone: account.mobile}});

      await CompanyOrdersModel.updateMany({
        $and: [
          {idCompany: account.idCompany},
          {accountName: account.accountName},
        ]
      },{$set:{accountName: account.accountName, accountPhone: account.mobile}});

      await CompanyPurchasesModel.updateMany({
        $and: [
          {idCompany: account.idCompany},
          {accountName: account.accountName},
        ]
      },{$set:{accountName: account.accountName, accountPhone: account.mobile}});

      await CompanyQuotationsModel.updateMany({
        $and: [
          {idCompany: account.idCompany},
          {accountName: account.accountName},
        ]
      },{$set:{accountName: account.accountName, accountPhone: account.mobile}});
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
  getCompanyAccountByName,
  getCompanyAccountsById,
  postCompanyAccount,
  importCompanyAccount,
  putCompanyAccount,
  deleteCompanyAccount,
  deleteImportCompanyAccount
}
