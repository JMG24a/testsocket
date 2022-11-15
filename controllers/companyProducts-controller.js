const CompanyProductsModel = require("../models/companyProducts");
const CompanyModel = require("../models/company");

const getCompanyProducts = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const Products = await CompanyProductsModel
    .find({idCompany: idCompany})
    .limit(options.limit)
    .skip(options.offset);

  return Products
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
  getCompanyProducts,
  postCompanyProduct,
  putCompanyProduct,
  deleteCompanyProduct
}
