const CompanyQuotationsModel = require("../models/companyQuotations.js");
const CompanyModel = require("../models/company");

const getCompanyQuotations = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const quotations = await CompanyQuotationsModel
    .find({idCompany: idCompany})
    .populate('contact')
    .limit(options.limit)
    .skip(options.offset);

  return quotations
};

const postCompanyQuotation = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const newQuotations = new CompanyQuotationsModel(body);
    const saveObject = await newQuotations.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyQuotation = async (id, body, token) => {

  const company = await CompanyModel.findById(body.idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const editCompanyQuotations = await CompanyQuotationsModel.findByIdAndUpdate(id, body, { new: true });
  return editCompanyQuotations
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
  getCompanyQuotations,
  postCompanyQuotation,
  putCompanyQuotation,
  deleteCompanyQuotation
}
