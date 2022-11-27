const CompanySalesModel = require("../models/companySales.js");
const UserModel = require("../models/User");
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
    const saveObject = (await newSale.save()).populate('contact');

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanySale = async (body, token) => {
  console.time();
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
      const sales = body.map(sale => {
        sale.idCompany = user.companies
        return sale
      })
      const options = { ordered: true };
      result = await CompanySalesModel.insertMany(sales, options);
      // await uploadedSale(token.sub.email)

    }else{
      const sales = body.map(sale => {
        sale.idCompany = user.companies
        return sale
      })
      const options = { ordered: true };
      result = await CompanySalesModel.insertMany(sales, options);
      // await uploadedSale(token.sub.email)
    }
    console.timeEnd();
    return result
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanySale = async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    console.log("SALES")
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(!company.employeesId.includes(token.sub.id)){
      console.log("fuck")
      return "este usuario no es un empleado"
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
  getCompanySales,
  postCompanySale,
  importCompanySale,
  putCompanySale,
  deleteCompanySale
}
