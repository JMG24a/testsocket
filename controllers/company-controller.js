const CompanyModel = require("../models/company");
const RelationModel = require("../models/Relation");
const userController = require("../controllers/user-controller");
const {editObject, createObject, delObject} = require("./tools/company-tools")

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
  const company = await CompanyModel.find({id: idCompany}).populate('employees');
  return company
};

const postCompany = async (body, token) => {
  try {
    body.employeesId = token.sub.id
    const company = new CompanyModel(body);
    const saveObject = await company.save();

    const user = await userController.getUser(token.sub.id)
    user.companies.push(saveObject.id)
    await userController.putUser(token, {companies: user.companies})

    const CompanyOwner = await getCompaniesUser(token.sub.id)

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
  console.log(body, id)

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

//employees
// Se comento esta ruta ya que se cambio la estrategia de relacion usuaro/empresa
// const addEmployeeCompany = async (token, userId) => {
//   const companies = await CompanyModel.find({userId: token.sub.id});
//   companies[0].employeesId.push(userId)
//   companies[0].employees.push({id: userId, status: false})

//   const tokenEmployeeUser = {
//     sub: {
//       id: userId
//     }
//   }
//   await userController.putUser(tokenEmployeeUser, {idCompany: companies._id})

//   const newCompany = await CompanyModel.updateOne({userId: token.sub.id}, {
//     employeesId: companies[0].employeesId
//   }, { new: true });

//   return  newCompany
// }

const addEmployeeCompanyById = async (token, idCompany) => {
  console.log('%cMyProject%cline:94%cidCompany', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px', idCompany)
  try {
    const companies = await CompanyModel.find({id: idCompany});
    companies[0].employeesId.push(token.sub.id)
    companies[0].employees.push({idEmployeeRef: token.sub.id, status: false})

    await userController.putUser(token, {idCompany: idCompany})

    const newCompany = await CompanyModel.updateOne({id: idCompany}, {
      employeesId: companies[0].employeesId,
      employees: companies[0].employees
    }, { new: true });

    return  newCompany
  } catch (error) {
    console.log(error.message)
  }
}

const disabledEmployeeCompany = async (token, userId) => {
  const companies = await CompanyModel.find({userId: token.sub.id});
  const index = companies[0].employeesId.indexOf(userId);
  const userObject = companies[0].employees[index];

  userObject.status = !userObject.status;
  companies[0].employees[index] = userObject;

  const newCompany = await CompanyModel.updateOne({userId: token.sub.id}, {
    employeesId: companies[0].employees
  }, { new: true });

  return  newCompany
}

const getEmployeeTakesCompanyInfo = async (token, idCompany) => {

  if(!idCompany){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.findById(idCompany);
  if(!companies){
    return "this user does not have permissions"
  }
  const isInclude = companies.employeesId.includes(token.sub.id);
  if(!isInclude){
    return "this user does not have permissions"
  }

  const contactsCompany = await RelationModel.find({companyId: idCompany})
  const contactsUser = await RelationModel.find({userId: token.sub.id})
  const contacts = [
    ...companies.contacts,
    ...contactsUser
  ]

  const infoCompany = {
    infoCompany: {
      name: companies.name,
      logo: companies.logo,
    },
    contacts,
    workOrders: companies.workOrders,
    sales: companies.sales,
    quotations: companies.quotations,
    products: companies.products,
    account: companies.account,
    opportunities: companies.opportunities,
  }

  return infoCompany
}

const createEmployeeTakesCompanyInfo = async (token, idCompany, body) => {
  if(!idCompany){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.findById(idCompany);
  if(!companies){
    return "this user does not have permissions"
  }
  const isInclude = companies.employeesId.includes(token.sub.id);
  if(!isInclude){
    return "this user does not have permissions"
  }

  const resultObject = createObject(body)

  if(resultObject === false){
    return "This property cannot created"
  }

  companies[body.selected].push(resultObject)

  const saveObject = await CompanyModel.findByIdAndUpdate(idCompany, {
    [body.selected]: companies[body.selected]
  }, { new: true });

  return saveObject
}



const editEmployeeTakesCompanyInfo = async (token, idCompany, body) => {
  if(!idCompany){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.findById(idCompany);
  if(!companies){
    return "this user does not have permissions"
  }
  const isInclude = companies.employeesId.includes(token.sub.id);
  if(!isInclude){
    return "this user does not have permissions"
  }

  const resultObject = editObject(companies[body.selected], body)
  if(resultObject === false){
    return "This property cannot edit"
  }

  const editCompany = await CompanyModel.findByIdAndUpdate(idCompany, {
    [body.selected]: resultObject
  }, { new: true });

  return editCompany
}

const deleteEmployeeTakesCompanyInfo = async (token, idCompany, id) => {
  if(!idCompany){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.findById(idCompany);
  const isInclude = companies.employeesId.includes(token.sub.id);
  if(!isInclude){
    return "this user does not have permissions"
  }

  const resultObject = delObject(companies[id.selected], id)

  if(resultObject === false){
    return "This property cannot edit"
  }

  const editCompany = await CompanyModel.findByIdAndUpdate(idCompany, {
    [id.selected]: resultObject
  }, { new: true });

  return editCompany
}

module.exports = {
  getCompaniesUser,
  getCompanyRepLegal,
  getCompany,
  postCompany,
  putCompany,
  deleteCompany,
  //employees
  // addEmployeeCompany,
  addEmployeeCompanyById,
  disabledEmployeeCompany,
  getEmployeeTakesCompanyInfo,
  createEmployeeTakesCompanyInfo,
  editEmployeeTakesCompanyInfo,
  deleteEmployeeTakesCompanyInfo
}
