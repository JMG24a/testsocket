const CompanyAccountsModel = require("../../models/companyAccounts");
const CompanyModel = require("../../models/company");
const UserModel = require("../../models/User")
const boom = require("@hapi/boom")

const getAccounts = async (key) => {
  const user = await UserModel.findOne({key: key})
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(company.employeesId.includes(user.id) === false){
      return "este usuario no es un empleado"
    }
  }else{
    throw boom.notFound("Empresa no encontrada")
  }

  const accounts = await CompanyAccountsModel
    .find({$or: [{idCompany: user.companies}, {idUser: user.id}]})
    .populate("contactId")
    .sort({createdAt:'descending'});

  return accounts
};

const getAccountsById = async (key, id) => {
  const user = await UserModel.findOne({key: key})
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(company.employeesId.includes(user.id) === false){
      return "este usuario no es un empleado"
    }
  }else{
    throw boom.notFound("Empresa no encontrada")
  }

  const Accounts = await CompanyAccountsModel
    .findById(id)
    .populate("contactId")

  return Accounts
};

const postAccount = async (body, key) => {
  try {
    const user = await UserModel.findOne({key: key})
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(user.id)){
        throw boom.conflict("este usuario no es un empleado")
      }
      body.idCompany = user.companies
    }else{
      body.idUser = user.id
    }

    // const bodyAccount = {
    //   idCompany: company.id,
    //   idUser: user.id,
    //   priority: body.prioridad || "",
    //   type: body.tipo || "Cliente",
    //   accountName: body.name,
    //   email: body.correo || "",
    //   accountValue: body.valor || "",
    //   website: body.web || "",
    //   observations: body.observacion || "",
    //   linkedinUrl: body.linkedin || "",
    //   category: body.categoria || "",
    //   subCategory: body.subCategoria || "",
    //   source: body.fuente || "",
    //   city: body.ciudad || "",
    //   address: body.direccion || "",
    //   country: body.pais || "",
    //   state: body.estado || "",
    //   nit: body.nit || "",
    //   stage: body.status || "",
    //   phone: body.telefono || "S.N.",
    //   mobile: body.movile || "S.N.",
    // }

    console.log("body", body)

    const newAccounts = new CompanyAccountsModel(body);
    const saveObject = await newAccounts.save();

    return saveObject
  }catch(e){
    console.log(e)
    throw boom.badRequest('El usuario no pudo ser creado')
  }
};

const putAccount = async (id, body, key) => {
  try {
    const user = await UserModel.findOne({key: key})
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(company.employeesId.includes(user.id) === false){
        return "este usuario no es un empleado"
      }
    }else{
      throw boom.notFound("Empresa no encontrada")
    }

    const editCompanyAccounts = await CompanyAccountsModel.findByIdAndUpdate(id, body, { new: true });
    return editCompanyAccounts
  } catch (error) {
    throw boom.badRequest("La cuenta no pudo ser actualizada")
  }
};

const deleteAccount = async (id, key) => {
  const user = await UserModel.findOne({key: key})
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(company.employeesId.includes(user.id) === false){
      return "este usuario no es un empleado"
    }
  }else{
    throw boom.notFound("Empresa no encontrada")
  }

  const delCompanyOrder = await CompanyAccountsModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getAccounts,
  getAccountsById,
  postAccount,
  putAccount,
  deleteAccount
}