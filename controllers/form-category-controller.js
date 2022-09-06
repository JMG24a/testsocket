const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const FormCategory = require('../models/FormCategory');

const getAllFormCategories = async (req = request, res = response) => {
    try {
        const formCategories = await FormCategory.find();

        res.status(200).json({
            ok: true,
            categories: formCategories
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo acceder a las categorías, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

const createFormCategory = async (req = request, res = response) => {
    try {
        const newCategory = new FormCategory(req.body);
        await newCategory.save();

        res.status(200).json({
            ok: true,
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo crear la categoría, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

const updateFormCategory = async (req = request, res = response) => {
    const { categoryId } = req.params;

    if(!isValidObjectId(categoryId)) return res.status(400).json({
        ok: false,
        message: 'Id de la categoría inválido.'
    });

    try {
        const categoryStored = FormCategory.findById(categoryId);
        
        if(!categoryStored) return res.status(404).json({
            ok: false,
            message: 'No existe categoría con ese id.'
        });

        const updatedCategory = await FormCategory.findByIdAndUpdate(categoryId, req.body, { new: true });

        res.status(200).json({
            ok: true,
            category: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo actualizar la categoría, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

const deleteFormCategory = async (req = request, res = response) => {
    const { categoryId } = req.params;

    if(!isValidObjectId(categoryId)) return res.status(400).json({
        ok: false,
        message: 'Id de la categoría inválido.'
    });

    try {
        const categoryStored = FormCategory.findById(categoryId);
        
        if(!categoryStored) return res.status(404).json({
            ok: false,
            message: 'No existe categoría con ese id.'
        });

        const updatedCategory = await FormCategory.findByIdAndDelete(categoryId);

        res.status(200).json({ 
            ok: true,
            message: 'Categoría eliminada correctamente.'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo eliminar la categoría, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

module.exports = {
    getAllFormCategories,
    createFormCategory,
    updateFormCategory,
    deleteFormCategory
}