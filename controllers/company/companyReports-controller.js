const CompanyPurchasesModel = require("../../models/company/companyPurchaseOrders");
const CompanySalesModel = require("../../models/company/companySales");
const CompanyQuotationsModel = require("../../models/company/companyQuotations.js")
const CompanyAccountsModel = require("../../models/company/companyAccounts");
const CompanyModel = require("../../models/company/company");
const UserModel = require("../../models/User");

const getReports = async (dates = {}, token) => {
  const start = dates.start;
  const end = dates.end;

  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }
  try {

    const report = await CompanySalesModel
      .find({$and: [
        {"date": {$gte : start}},
        {"date": {$lte : end}},
        {"idCompany": user.companies}
      ]})
      .populate('contact')

    const countSales = await CompanySalesModel
      .count({$and: [
        {"createdAt": {$gte : start}},
        {"createdAt": {$lte : end}},
        {"idCompany": user.companies}
      ]})

    const countQuotations = await CompanyQuotationsModel
    .count({$and: [
      {"createdAt": {$gte : start}},
      {"createdAt": {$lte : end}},
      {"idCompany": user.companies}
    ]})

    const countAccounts = await CompanyAccountsModel
    .count({$and: [
      {"createdAt": {$gte : start}},
      {"createdAt": {$lte : end}},
      {"idCompany": user.companies}
    ]})

    const counts = {
      countSales,
      countQuotations,
      countAccounts,
    }

    return {report, counts}
  } catch (error) {
    console.log(error)
  }
};

module.exports = {
  getReports,
}
