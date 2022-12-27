const boom = require("@hapi/boom");
const ProceduresModel = require("../models/Procedures");
const UserModel = require("../models/User");
const CompanyModel = require("../models/company/company")

const getProcedures = async () => {
  const procedure = await ProceduresModel.find();
  if(!procedure){
    throw boom.notFound("documento no encontrado")
  }
  return procedure
};

const getProcedureByUser = async (token) => {
  try{
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      throw boom.notFound("Este no es un usuario")
    }

    const procedure = await ProceduresModel
      .find({
        $or: [
          {idCompany: user.companies}, {idUsers: user.id}
        ]})
      .sort({createdAt: "desc"});

    return procedure
  }catch(e){
    throw boom.notFound('El documento no fue encontrado')
  }
};

const getProcedureById = async (id) => {
  try{
    if(!id){
      throw boom.badRequest('Los datos no estan completos')
    }
    const procedure = await ProceduresModel.findById(id)
      .populate("idUsers")
      .populate("idCompany");

    if(!procedure){
      throw boom.notFound('El documento no fue encontrado')
    }
    return procedure
  }catch(e){
    throw boom.notFound('El documento no fue encontrado')
  }
};

const getOneProcedure = async (id) => {
  if(!id){
    return 'El documento no fue encontrado'
  }
  try{
    const procedure = await ProceduresModel.findById(id);
    return procedure
  }catch(e){
    console.error(e)
  }
};

const postProcedure = async (body, token) => {
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        return "este usuario no es un empleado"
      }
      body.idCompany = user.companies
    }
    body.idUsers.push(token.sub.id)

    const procedure = new ProceduresModel(body);
    const newProcedure =  await procedure.save();

    return ({
      ...newProcedure.toObject()
    })
  }catch(e){
    throw boom.badRequest('El documento no pudo ser guardado')
  }
};

const putProcedure = async (id, body) => {
  const procedure = await getOneProcedure(id);

  if (typeof procedure === 'string') {
    throw boom.notFound("Documento no encontrado")
  }

  const newProcedure = await ProceduresModel.findByIdAndUpdate(id, body, { new: true });
  if(!newProcedure){
    throw boom.badRequest("Error al actualizar")
  }
  return newProcedure
};

const deleteProcedure = async (id) => {
  const deleteProcedure = await ProceduresModel.findByIdAndDelete(id);
  if(!deleteProcedure){
    throw boom.notFount("Documento no encontrado")
  }
  return deleteProcedure
};

module.exports = {
  getProcedures,
  getProcedureByUser,
  getProcedureById,
  getOneProcedure,
  postProcedure,
  putProcedure,
  deleteProcedure
}
