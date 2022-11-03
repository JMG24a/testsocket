const CompanyModel = require("../models/company");
const userController = require("../controllers/user-controller");

const getCompanies = async () => {
  const companies = await CompanyModel.find();
  return companies
};

const getCompaniesUser = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.find({employeesId: id});
  return companies
};

const getCompanyRepLegal = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.find({userId: id});
  return companies
};

const getCompany = async (id, idCompany) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const company = await CompanyModel.find({id: idCompany});
  return company
};

const postCompany = async (body, token) => {
  try {
    body.employeesId = token.sub.id
    const company = new CompanyModel(body);
    const saveObject = await company.save();

    const CompanyOwner = await getCompaniesUser(token.sub.id)
    const user = await userController.getUser(token.sub.id)

    user.companies.push(saveObject.id)
    await userController.putUser(token, {companies: CompanyOwner})

    return CompanyOwner
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompany = async (id, body) => {
  const company = await getCompaniesUser(id);
  if (typeof company === 'string') {
    return company
  }

  const newCompany = await CompanyModel.findByIdAndUpdate(id, body, { new: true });
  return newCompany
};

const deleteCompany = async (id, token) => {
  let user = await userController.getUser(token.sub.id)
  user.companies = user.companies.filter(_id => _id === id)
  await userController.putUser(token, {companies: user.companies})

  const companyDelete = await CompanyModel.findByIdAndDelete(id);
  return companyDelete ? true : false;
};

module.exports = {
  getCompanies,
  getCompaniesUser,
  getCompanyRepLegal,
  getCompany,
  postCompany,
  putCompany,
  deleteCompany
}
