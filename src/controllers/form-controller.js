const FormModel = require("../../database/models/Form");

const getForms = async () => {
  const form = await FormModel.find();
  return form
};

const getForm = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const form = await FormModel.find({user: id});
  return form
};

const postForm = async (body) => {
  try {
    const form = new FormModel(body);
    const newForm =  await form.save();

    const formInfo ={
      title: newForm.title,
      type: newForm.type,
    }

    return formInfo
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putForm = async (id, body) => {
  const form = await getProperty(id);

  if (typeof form === 'string') {
    return form
  }

  const newForm = await FormModel.findByIdAndUpdate(id, body, { new: true });
  return newForm
};

const deleteForm = async (id) => {
  const deleteProperty = await FormModel.findByIdAndDelete(id);
  return deleteProperty ? true : false;
};

module.exports = {
  getForms,
  getForm,
  postForm,
  putForm,
  deleteForm
}
