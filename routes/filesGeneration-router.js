const { isValidObjectId } = require('mongoose');
const { Router } = require("express")
const router = Router()
const boom = require("@hapi/boom")

const Procedures = require('../models/Procedures');
const { 
    generatePDFFile, 
    generateXLSFile, 
    generateZIPFile, 
    generateDOCFile, 
    generateJPGFile
} = require('../services/files');

const generateFile = async(req, res, next) => {
    //Validar que el URL sí traiga el tipo de archivo
    const {fileType, nameFile} = req.params;
    if(!fileType){
        throw boom.badRequest('El tipo de archivo es requerido.')
    };
 
    //Acceder a la información del trámite
    const { id } = req.body;
    try {
        const procedure = await Procedures.findById(id).populate("idForm");

        if(!procedure){
            throw boom.notFound('No se encontró ningún trámite.')
        }

        //Generación del archivo según el tipo
        switch (fileType) {
            case 'pdf':
                return generatePDFFile(procedure, nameFile, res);
            case 'xls':
                return generateXLSFile(procedure, nameFile, res);
            case 'zip':
                return generateZIPFile(procedure, nameFile, res);
            case 'doc':
                return generateDOCFile(procedure, nameFile, res);
            case 'jpg':
                return generateJPGFile(procedure, nameFile, res);
            default: 
                throw boom.notFound('El tipo de archivo no es soportado');

        }
    } catch (error) {
        next(error)
    }
}

router.post("/:fileType/:nameFile", generateFile)

module.exports = router