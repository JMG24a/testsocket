const { response } = require('express');
const fs = require("fs")
const path = require("path")
const { documentWithHtmlAndCss } = require("../templates")
const { pdfGmail } = require("../mails/pdfGmail")
//Lib
const pdf = require("pdf-creator-node")
const Handlebars = require("handlebars");
const HTMLtoDOCX = require('html-to-docx');
const boom = require('@hapi/boom');

generatePDFFile = (data, nameFile, res = response) => {
  const { procedure } = data;
  if(!procedure){
    throw boom.badData('La información necesaria está incompleta')
  }

  const FILE_NAME = nameFile;
  const html = documentWithHtmlAndCss(FILE_NAME)

  const options = {
    format: "Letter",
    orientation: "portrait",
    border: "20mm",
  }

  const document = {
    html: html,
    data: procedure.stages || {},
    path: "./output.pdf",
    type: "buffer",
  }
  
  pdf.create(document, options)
  .then((result) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${FILE_NAME}.pdf`);
      res.send(result);
  })
  .catch((error) => {
      console.error(error);
  });
}

generateGmailFile = async(data, nameFile, res = response) => {
  const { gmail, procedure } = data;
  if(!gmail | !procedure){
    throw boom.badData('La información necesaria está incompleta')
  }

  const FILE_NAME = nameFile
  const html = documentWithHtmlAndCss(FILE_NAME)

  const options = {
    format: "Letter",
    orientation: "portrait",
    border: "20mm",
  }

  const document = {
    html: html,
    data: procedure.stages || {},
    path: "./output.pdf",
    type: "buffer",
  }
  
  try{
    const result = await pdf.create(document, options)
    const content = `<b>Formuapp</b>`;
    await pdfGmail('jmg24a@gmail.com', procedure.idUser, content, result);
    res.json({
      ok: true,
      msg: "correo enviado"
    });
  }catch(e){
    console.log(e)
    throw boom.badData("No se logro enviar el correo")
  }
}

generateXLSFile = (procedure, nameFile, res = response) => {
    //Toda la lógica necesaria para generar un archivo xls y retornarlo

    return res.status(200).json({
        ok: true,
        file: "Archivo XLS generado"
    });
}

generateZIPFile = (procedure, nameFile, res = response) => {
    //Toda la lógica necesaria para generar un archivo zip y retornarlo

    return res.status(200).json({
        ok: true,
        file: "Archivo ZIP generado"
    });
}

generateDOCFile = async(data, nameFile, res = response) => {
  const { procedure } = data
  if(!procedure){
    throw boom.badData('La información necesaria está incompleta')
  }

  const FILE_NAME = nameFile
  let preHtml = documentWithHtmlAndCss(FILE_NAME)

  html = Handlebars.compile(preHtml)({
    data: procedure.stages
  });
  const fileBuffer = await HTMLtoDOCX(html, null);
  res.setHeader('Content-Type', 'application/docx');
  res.setHeader('Content-Disposition', 'attachment; filename=download.docx');
  res.send(fileBuffer);
}

generateJPGFile = (procedure, nameFile, res = response) => {
  //Toda la lógica necesaria para generar un archivo jpg y retornarlo
  return res.status(200).json({
    ok: true,
    file: "Archivo JPG generado"
  });
}

module.exports = {
  generatePDFFile,
  generateGmailFile,
  generateXLSFile,
  generateZIPFile,
  generateDOCFile,
  generateJPGFile
}
