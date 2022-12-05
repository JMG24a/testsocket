const CompanyModel = require("../models/company");
const ContactModel = require("../models/contacts");
const UserModel = require("../models/User")
const userController = require("../controllers/user-controller");
const {editObject, createObject, delObject} = require("./tools/company-tools")

const getCompaniesUser = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.find({employeesId: id});
  return companies
};

const getCompanyByEmployee = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const companies = await CompanyModel.find({$or:[{employeesId: id},{userId: id}]}).populate('employees.idEmployeeRef')
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
    body.userId = token.sub.id
    const company = new CompanyModel(body);
    const saveObject = await company.save();

    const user = await UserModel.findById(token.sub.id)
    user.companies.push(saveObject.id)
    const CompanyOwner = await UserModel.findByIdAndUpdate(token.sub.id, {
      companies: user.companies,
      plan:{
        planInfo:   "6356f191e8d78287a074838e",
        expireDate: "01/12/2023",
        extraTime:  "nothing"
      }
    },{ new: true })

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
  console.log('%cMyProject%cline:97%cidCompany', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px', idCompany)
  try {
    const companies = await CompanyModel.findById(idCompany).populate("userId");

    if(companies?.employees.length === 0){
      companies.employees.push({idEmployeeRef: token.sub.id, status: false})
    }else{
      companies.employees.filter(item => item?.idEmployeeRef != token.sub.id)
      companies.employees.push({idEmployeeRef: token.sub.id, status: false})
    }

    // console.log("userPlan", companies.userId[0].plan)

    // await UserModel.findByIdAndUpdate(token.sub.id,
    //   {
    //     companies: idCompany,
    //     plan:{
    //       ...companies.userId[0].plan
    //     }
    //   }, {new: true})


    const newCompany = await CompanyModel.findByIdAndUpdate(idCompany, {
      employees: companies.employees
    }, { new: true });


    return  newCompany
  } catch (error) {
    console.log(error.message)
  }
}

const disabledEmployeeCompany = async (token, id) => {
  const companies = await CompanyModel.find({userId: token.sub.id}).populate("userId");

  companies[0].employees = companies[0].employees.map(item => {
    if(item?.idEmployeeRef == id){
      item.status = !item.status
      if(!item.status){
        companies[0].employeesId = companies[0].employeesId.filter(item => item != id);
        new Promise(async(resolve, reject)=>{
          await UserModel.findByIdAndUpdate(id,
            {
              companies: null,
              plan:{
                ...companies[0].userId[0].plan,
                planInfo: "63068b13e4bb2ceac56b77ed",//plan basic
                paymentMethod:  null,
                expireDate:     "expired",
                extraTime:      "aun no se para que usarlo"
              }
            }, {new: true})
        })
      }else{
        companies[0].employeesId = companies[0].employeesId.push(id);
         new Promise(async(resolve, reject)=>{
          await  UserModel.findByIdAndUpdate(id,
            {
              companies: [companies[0]._id],
              plan:{
                ...companies[0].userId[0].plan
              }
            }, {new: true})
        })
      }
      return item
    }
    return item
  });

  const newCompany = await CompanyModel.updateOne({userId: token.sub.id}, {
    employeesId: companies[0].employeesId,
    employees: companies[0].employees
  }, { new: true });

  return newCompany
}

const delEmployeeCompany = async (token, id) => {
  const companies = await CompanyModel.find({userId: token.sub.id});

  companies[0].employeesId = companies[0].employeesId.filter(item => item != id);
  companies[0].employees = companies[0].employees.filter(item => item?.idEmployeeRef != id);

  const newCompany = await CompanyModel.updateOne({userId: token.sub.id}, {
    employeesId: companies[0].employeesId,
    employees: companies[0].employees
  }, { new: true });

  return newCompany
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

  const contactsCompany = await ContactModel.find({companyId: idCompany})
  const contactsUser = await ContactModel.find({userId: token.sub.id})
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
  getCompanyByEmployee,
  getCompany,
  postCompany,
  putCompany,
  deleteCompany,
  //employees
  // addEmployeeCompany,
  addEmployeeCompanyById,
  disabledEmployeeCompany,
  delEmployeeCompany,
  getEmployeeTakesCompanyInfo,
  createEmployeeTakesCompanyInfo,
  editEmployeeTakesCompanyInfo,
  deleteEmployeeTakesCompanyInfo
}
