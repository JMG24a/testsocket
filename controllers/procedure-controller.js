const ProceduresModel = require("../models/Procedures");

const getProcedures = async () => {
  const procedure = await ProceduresModel.find();
  return procedure
};

const getProcedureByUser = async (id) => {
  if(!id){
    return 'El procedimiento no fue encontrado'
  }
  try{
    const procedure = await ProceduresModel.find({idUsers: id.sub.id});
    return procedure
  }catch(e){
    console.error(e)
  }
};

const getOneProcedure = async (id) => {
  if(!id){
    return 'El procedimiento no fue encontrado'
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

    return ({
      ...newProcedure.toObject()
    })
  }catch(e){
    throw new Error ('El Proceso no pudo ser Guardado')
  }
};

const putProcedure = async (id, body) => {
  const procedure = await getOneProcedure(id);

  if (typeof procedure === 'string') {
    return procedure
  }

  const newProcedure = await ProceduresModel.findByIdAndUpdate(id, body, { new: true });
  return newProcedure
};

const deleteProcedure = async (id) => {
  const deleteProcedure = await ProceduresModel.findByIdAndDelete(id);
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
