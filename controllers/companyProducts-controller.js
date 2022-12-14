const CompanyProductsModel = require("../models/companyProducts.js");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User");
const boom = require("@hapi/boom");
const { getDateInString } = require("../helper/getDateInString.js");


const getSearchProducts = async (value, token, options) => {
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

    const products = await CompanyProductsModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyProductsModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .count()

    return {products, count}
  } catch (error) {
    console.log(error.message)
  }
};


const getCompanyProducts = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const products = await CompanyProductsModel
    .find({idCompany: idCompany})
    .limit(options.limit)
    .skip(options.offset);

    const count = await CompanyProductsModel
      .find({idCompany: idCompany})
      .count()

  return {products, count}
};

const postCompanyProduct = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const newProducts = new CompanyProductsModel(body);
    const saveObject = await newProducts.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanyProducts = async (body, token) => {
  console.time();
  try {
    let result = "Error no encontrado"
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      throw boom.notFound("este no es un usuario")
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        throw boom.notFound("este usuario no es un empleado")
      }
      const products = body.map(product => {
        product.idCompany = user.companies
        const dateImport = new Date()
        product.dateImport = getDateInString(dateImport)
        return product
      })
      const options = { ordered: false };
      result = await CompanyProductsModel.insertMany(products, options);
      await uploadedAccounts(token.sub.email)
    }
    
    console.timeEnd();
    return result
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyProduct = async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  if(!company.employeesId.includes(token.sub.id) ){
    if(!company.userId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
  }

  const editCompanyProducts = await CompanyProductsModel.findByIdAndUpdate(id, body, { new: true });
  return editCompanyProducts
};

const deleteCompanyProduct = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyProductsModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

const deleteImportCompanyProduct = async (body, token) => {

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

  const delCompanyProducts = await CompanyProductsModel.deleteMany({
    $and: [
      {$or:[
        {idUser: body.id},
        {idCompany: body.idCompany}
      ]},
      {"dateImport": {$eq : body.start}}
    ]
  });

  if(delCompanyProducts.deletedCount === 0){
    return false
  }

  return delCompanyProducts.acknowledged ? true : false;
};

module.exports = {
  getSearchProducts,
  getCompanyProducts,
  postCompanyProduct,
  importCompanyProducts,
  putCompanyProduct,
  deleteCompanyProduct,
  deleteImportCompanyProduct
}
