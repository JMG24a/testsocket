const CompanyOrdersModel = require("../models/companyOrders");
const CompanyModel = require("../models/company");
const userController = require("../controllers/user-controller");

const getCompanyOrders = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const orders = await CompanyOrdersModel
    .find({idCompany: idCompany})
    .populate('contact')
    .limit(options.limit)
    .skip(options.offset);

  return orders
};

const postCompanyOrder = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const companyOrder = new CompanyOrdersModel(body);
    const saveObject = await companyOrder.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyOrder= async (id, body, token) => {

  const company = await CompanyModel.findById(body.idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const editCompanyOrder = await CompanyOrdersModel.findByIdAndUpdate(id, body, { new: true });
  return editCompanyOrder
};

const deleteCompanyOrder = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyOrdersModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getCompanyOrders,
  postCompanyOrder,
  putCompanyOrder,
  deleteCompanyOrder
}
