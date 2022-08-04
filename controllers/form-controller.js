const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const Form = require('../models/Form');

const getAllForms = async (req, res = response) => {
    try {
        const forms = await Form.find();

        res.status(200).json({
            ok: true,
            forms
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo acceder a los formularios, contacte un administrador.',
            errorDescription: error.message
        });
    }
};

const getFormById = async (req = request, res = response) => {
    const { formId } = req.params;

    if(!isValidObjectId(formId)) return res.status(404).json({
        ok: false,
        message: 'No pudimos encontrar ningún formulario con ese Id.'
    });

    try {
        const form = await Form.find({ '_id': formId });
        
        res.status(200).json({
            ok: true,
            form
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo acceder al formulario, contacte un administrador.',
            errorDescription: error.message
        });
    }
};

// const postForm = async (body) => {
//   try {
//     const form = new FormModel(body);
//     const newForm =  await form.save();

//     const formInfo ={
//       title: newForm.title,
//       type: newForm.type,
//     }

//     return formInfo
//   }catch(e){
//     throw new Error ('El usuario no pudo ser creado')
//   }
// };

// const putForm = async (id, body) => {
//   const form = await getProperty(id);

//   if (typeof form === 'string') {
//     return form
//   }

//   const newForm = await FormModel.findByIdAndUpdate(id, body, { new: true });
//   return newForm
// };

// const deleteForm = async (id) => {
//   const deleteProperty = await FormModel.findByIdAndDelete(id);
//   return deleteProperty ? true : false;
// };

module.exports = {
  getAllForms,
  getFormById,
//   postForm,
//   putForm,
//   deleteForm
}
