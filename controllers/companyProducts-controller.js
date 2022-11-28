const CompanyProductsModel = require("../models/companyProducts.js");
const CompanyModel = require("../models/company");
const UserModel = require("../models/User")

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

const putCompanyProduct = async (id, body, token) => {

  const company = await CompanyModel.findById(body.idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
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

module.exports = {
  getSearchProducts,
  getCompanyProducts,
  postCompanyProduct,
  putCompanyProduct,
  deleteCompanyProduct
}
