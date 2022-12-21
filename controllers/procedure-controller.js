const boom = require("@hapi/boom");
const ProceduresModel = require("../models/Procedures");

const getProcedures = async () => {
  const procedure = await ProceduresModel.find();
  if(!procedure){
    throw boom.notFound("documento no encontrado")
  }
  return procedure
};

const getProcedureByUser = async (id) => {
  if(!id){
    throw boom.notFound('El usuario no fue encontrado')
  }
  try{
    const procedure = await ProceduresModel.find({idUsers: id.sub.id})
      .sort({createdAt: "desc"});
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

const postProcedure = async (body) => {
  try {
    const procedure = new ProceduresModel(body);
    const newProcedure =  await procedure.save();
    console.log('%cMyProject%cline:39%cnewProcedure', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px', newProcedure)

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
  getOneProcedure,
  postProcedure,
  putProcedure,
  deleteProcedure
}
