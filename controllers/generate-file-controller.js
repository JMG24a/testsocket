const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const Procedures = require('../models/Procedures');
const { 
    generatePDFFile, 
    generateXLSFile, 
    generateZIPFile, 
    generateDOCFile, 
    generateJPGFile
} = require('../services/files');

const generateFile = async(req = request, res = response) => {
    //Validar que el URL sí traiga el tipo de archivo
    const fileType = req.query.fileType;
    if(!fileType) return res.status(400).json({
        ok: false,
        message: 'El tipo de archivo es requerido.'
    });

    //Validar que el id del Procedure que viene en el body sí sea válido
    const procedureId = req.body.procedureId;
    if(!procedureId || !isValidObjectId(procedureId)) return res.status(400).json({
        ok: false,
        message: 'Se requiere un id del trámite válido.'
    });

    //Acceder a la información del trámite
    try {
        const procedure = await Procedures.findById(procedureId);

        if(!procedure) return res.status(404).json({
            ok: false,
            message: 'No se encontró ningún trámite.'
        });

        //Generación del archivo según el tipo
        switch (fileType) {
            case 'pdf':
                return generatePDFFile(procedure, res);
            case 'xls':
                return generateXLSFile(procedure, res);
            case 'zip':
                return generateZIPFile(procedure, res);
            case 'doc':
                return generateDOCFile(procedure, res);
            case 'jpg':
                return generateJPGFile(procedure, res);
            default:
                return res.status(400).json({
                    ok: false,
                    message: 'El tipo de archivo no es soportado'
                });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo acceder al trámite, contacte un administrador.',
            errorDescription: error.message
        });
    }

    res.status(200).json({
        ok: true,
        message: fileType
    });
}

module.exports = {
    generateFile
}