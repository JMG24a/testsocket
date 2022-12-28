const { isValidObjectId } = require('mongoose');
const { Router } = require("express")
const router = Router()
const boom = require("@hapi/boom")

const Procedures = require('../models/Procedures');

const {
  generatePDFFile,
  generateEmailFile,
  generateLinkFile,
  generateXLSFile,
  generateZIPFile,
  generateDOCFile,
  generateJPGFile
} = require('../services/files');
const { validateToken } = require('../auth/middleware/jwt');

const ALLOWED_ORIENTATIONS = ["portrait", "landscape"]
const ALLLOWED_FORMATS = ["Letter", "A3", "A4", "A5", "Legal", "Tabloid"]

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
  const { id, pdfOptions, documentData } = req.body;

  try {
    let procedure;

    if(id) {
      procedure = await Procedures.findById(id)
        .populate("idForm")
        .populate("idUsers");
    }

    if(!procedure && typeof documentData === "object" && documentData !== null) {
      procedure = {};
      procedure.stages = documentData;
    }

    if(!procedure){
      throw boom.notFound('No se encontró ningún trámite.')
    }
    //almacenando procedure
    data.procedure = procedure

    data.options = {
      format: ALLLOWED_FORMATS.includes(pdfOptions?.format) ? pdfOptions?.format : "Letter",
      orientation: ALLOWED_ORIENTATIONS.includes(pdfOptions?.orientation) ? pdfOptions?.orientation : "portrait"
    }

    //Generación del archivo según el tipo
    switch (fileType) {
      case 'pdf':
        return generatePDFFile(data, nameFile, res);
      case 'email':
        return await generateEmailFile(data, nameFile, res);
      case 'link':
        return generateLinkFile(data, nameFile, res);
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

const generatePublicFiles = async(req, res, next) => {
  //almacen de datos
  const data = {}

  //Validar que el URL sí traiga la informacion completa en params
  const { fileType, nameFile, } = req.params;
  if(!fileType){
      throw boom.badRequest('El tipo de archivo es requerido.')
  };
  const resultFileType = fileType;
  const resultNameFile = nameFile

  //Validar que el URL sí traiga la informacion completa en query
  const { id, pdfOptions } = req.body;
  if(!id){
      throw boom.badRequest('El tipo de archivo es requerido.')
  };

  const resultId = id

  try {
    const procedure = await Procedures.findById(resultId)
      .populate("idForm")
      .populate("idUsers");

    if(!procedure){
      throw boom.notFound('No se encontró ningún trámite.')
    }
    //almacenando procedure
    data.procedure = procedure

    data.options = {
      format: ALLLOWED_FORMATS.includes(pdfOptions?.format) ? pdfOptions?.format : "Letter",
      orientation: ALLOWED_ORIENTATIONS.includes(pdfOptions?.orientation) ? pdfOptions?.orientation : "portrait"
    }

    //Generación del archivo según el tipo
    switch (resultFileType) {
      case 'pdf':
        return generatePDFFile(data, resultNameFile, res);
      case 'doc':
        return generateDOCFile(data, resultNameFile, res);
      default:
        throw boom.notFound('El tipo de archivo no es soportado');
    }
  } catch (error) {
    next(error)
  }
}

router.post("/public/:fileType/:nameFile", generatePublicFiles)
router.post("/:fileType/:nameFile", validateToken, generateFile)

module.exports = router
