const CompanyModel = require("../../models/company/company");
const ContactModel = require("../../models/contacts");
const UserModel = require("../../models/User")
const userController = require("../user-controller");
const planes = require("../../constants/planes");
const boom = require("@hapi/boom");

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
              companies: [],
              plan:{
                ...companies[0].userId[0].plan,
                planInfo: "63068b13e4bb2ceac56b77ed",//plan basic
                paymentMethod:  null,
                expireDate:     "expired",
                extraTime:      "aun no se para que usarlo",
                availableModules: false
              }
            }, {new: true})
        })
      }else{
        companies[0].employeesId = companies[0].employeesId.push(id);
        console.log("companies[0].userId[0].plan", companies[0].userId[0].plan)
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
  try{
    const companies = await CompanyModel.find({userId: token.sub.id});
    if(!companies){
      throw boom.conflict("Solo en dueño de la empresa puede eliminar un empleado")
    }
  
    await UserModel.findByIdAndUpdate(id,
      {
        companies: [],
        plan:{
          ...companies[0].userId[0].plan,
          planInfo: planes.PLAN_BASIC,
          paymentMethod:  null,
          expireDate:     "expired",
          extraTime:      "aun no se para que usarlo",
          availableModules: false
        }
      }, {new: true})
  
    companies[0].employeesId = companies[0].employeesId.filter(item => item != id);
    companies[0].employees = companies[0].employees.filter(item => item?.idEmployeeRef != id);
  
    const newCompany = await CompanyModel.updateOne({userId: token.sub.id}, {
      employeesId: companies[0].employeesId,
      employees: companies[0].employees
    }, { new: true });
  
    return newCompany
  }catch(e){
    throw boom.badData("No se logro eliminar al empleado")
  }
}

module.exports = {
  getCompaniesUser,
  getCompanyByEmployee,
  getCompany,
  postCompany,
  putCompany,
  deleteCompany,
  //employees
  addEmployeeCompanyById,
  disabledEmployeeCompany,
  delEmployeeCompany,
}
