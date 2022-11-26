const CompanySalesModel = require("../models/companySales.js");
const CompanyModel = require("../models/company");

const getCompanySales = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const sales = await CompanySalesModel
    .find({idCompany: idCompany})
    .populate("contact")
    .limit(options.limit)
    .skip(options.offset);

  return sales
};

const postCompanySale = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const newSale = new CompanySalesModel(body);
    const saveObject = await newSale.save();

    const newSales = await CompanySalesModel.findById(saveObject._id).populate('contact')
    return newSales
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanySale = async (id, body, token) => {
  const company = await CompanyModel.findById(body.idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  await CompanySalesModel.findByIdAndUpdate(id, body, { new: true });

  const newSales = await CompanySalesModel.findById(id).populate('contact')
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
  getCompanySales,
  postCompanySale,
  putCompanySale,
  deleteCompanySale
}
