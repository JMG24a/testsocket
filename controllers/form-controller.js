const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const Form = require('../models/Form');
const ModelUser = require('../models/User');

const getAllForms = async (req = request, res = response) => {
  const {query} = req.query;
  try {
    const forms = await Form.find().populate('webContentPost');

    let formFilters = forms;

    if(query !== undefined){
      const filter = forms.filter(item => {
        const keys = item.keywords.split(", ");
        const result = keys.map(item => item.includes(query));
        const isTrue = result.filter(item => item === true)
        if(isTrue.length > 0){
          return true
        }else{
          return false
        }
      })
      formFilters = filter;
    }

    res.status(200).json({
      ok: true,
      forms: formFilters
    });
  }catch (error) {
    res.status(500).json({
        ok: false,
        message: 'No se pudo acceder a los formularios, contacte un administrador.',
        errorDescription: error.message
    });
  }
};

const getFormById = async (req = request, res = response) => {
    const { formId } = req.params;

    if(!isValidObjectId(formId)) return res.status(400).json({
        ok: false,
        message: 'Id de formulario inválido.'
    });

    try {
        const form = await Form.findById(formId);

        if(!form) return res.status(404).json({
            ok: false,
            message: 'No pudimos encontrar ningún formulario con ese Id.'
        });

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

const createNewForm = async (req = request, res = response) => {
    try {
        const newForm = new Form(req.body);
        await newForm.save();

        res.status(201).json({
            ok: true,
            form: newForm
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo crear el nuevo formulario, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

const updateFormById = async(req = request, res = response) => {
    const { formId } = req.params;

    if(!isValidObjectId(formId)) return res.status(400).json({
        ok: false,
        message: 'Id de formulario inválido.'
    });

    try {
        const form = await Form.findById(formId);

        if(!form) return res.status(404).json({
            ok: false,
            message: 'El formulario que trata de actualizar no existe.'
        });

        const updatedForm = await Form.findByIdAndUpdate(formId, req.body, { new: true });

        res.status(200).json({
            ok: true,
            newForm: updatedForm
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo actualizar el formulario, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

const deleteFormById = async(req = request, res = response) => {
    const { formId } = req.params;

    if(!isValidObjectId(formId)) return res.status(400).json({
        ok: false,
        message: 'Id de formulario inválido.'
    });

    try {
        const form = await Form.findById(formId);

        if(!form) return res.status(404).json({
            ok: false,
            message: 'El formulario no existe.'
        });

        await Form.findByIdAndDelete(formId);

        res.status(200).json({ ok: true });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo eliminar el formulario, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

module.exports = {
  getAllForms,
  getFormById,
  createNewForm,
  updateFormById,
  deleteFormById,
}
