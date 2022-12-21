const { isValidObjectId } = require('mongoose');
const { Router } = require("express")
const router = Router()
const boom = require("@hapi/boom")

const Procedures = require('../models/Procedures');
const {
    generatePDFFile,
    generateEmailFile,
    generateXLSFile,
    generateZIPFile,
    generateDOCFile,
    generateJPGFile
} = require('../services/files');

const generateFile = async(req, res, next) => {
  //almacen de datos
  const data = {}

  //contexto query
  const { email } = req.body

  //datos para enviar email
  if(email){
      data.email = email
  }

  //Validar que el URL sí traiga el tipo de archivo
  const {fileType, nameFile} = req.params;
  if(!fileType){
      throw boom.badRequest('El tipo de archivo es requerido.')
  };

  //Acceder a la información del trámite
  const { id } = req.body;
  try {
    const procedure = await Procedures.findById(id)
      .populate("idForm")
      .populate("idUsers");

    if(!procedure){
      throw boom.notFound('No se encontró ningún trámite.')
    }
    //almacenando procedure
    data.procedure = procedure

    //Generación del archivo según el tipo
    switch (fileType) {
      case 'pdf':
        return generatePDFFile(data, nameFile, res);
      case 'email':
        return await generateEmailFile(data, nameFile, res);
      case 'xls':
        return generateXLSFile(data, nameFile, res);
      case 'zip':
        return generateZIPFile(data, nameFile, res);
      case 'doc':
        return generateDOCFile(data, nameFile, res);
      case 'jpg':
        return generateJPGFile(data, nameFile, res);
      default:
        throw boom.notFound('El tipo de archivo no es soportado');
    }
  } catch (error) {
    next(error)
  }
}

router.post("/:fileType/:nameFile", generateFile)

module.exports = router
