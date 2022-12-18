const { response } = require('express');
const fs = require("fs")
const path = require("path")
//Lib
const pdf = require("pdf-creator-node")
const Handlebars = require("handlebars");
const HTMLtoDOCX = require('html-to-docx');

generatePDFFile = (procedure, res = response) => {
  //Toda la lógica necesaria para generar un archivo pdf y retornarlo
  const regex = / /ig;
  const FILE_NAME = procedure.title.replace(regex, "").toLowerCase()
  const html = fs.readFileSync(path.join(__dirname, "../templates/html/" + FILE_NAME + ".html"), "utf8")

  const options = {
      format: "Letter",
      orientation: "portrait",
      border: "20mm",
  }

  const document = {
      html: html,
      data: procedure.stages,
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

generateXLSFile = (procedure, res = response) => {
    //Toda la lógica necesaria para generar un archivo xls y retornarlo

    return res.status(200).json({
        ok: true,
        file: "Archivo XLS generado"
    });
}

generateZIPFile = (procedure, res = response) => {
    //Toda la lógica necesaria para generar un archivo zip y retornarlo

    return res.status(200).json({
        ok: true,
        file: "Archivo ZIP generado"
    });
}

generateDOCFile = async(procedure, res = response) => {
  //Toda la lógica necesaria para generar un archivo doc y retornarlo
  const regex = / /ig;
  const FILE_NAME = procedure.title.replace(regex, "").toLowerCase()
  let html = fs.readFileSync(path.join(__dirname, "../templates/html/" + FILE_NAME +".html"), "utf8");

  html = Handlebars.compile(html)({
    data: procedure.stages
  });
  const fileBuffer = await HTMLtoDOCX(html, null);
  res.setHeader('Content-Type', 'application/docx');
  res.setHeader('Content-Disposition', 'attachment; filename=download.docx');
  res.send(fileBuffer);
}

generateJPGFile = (procedure, res = response) => {
    //Toda la lógica necesaria para generar un archivo jpg y retornarlo
    return res.status(200).json({
        ok: true,
        file: "Archivo JPG generado"
    });
}

module.exports = {
    generatePDFFile,
    generateXLSFile,
    generateZIPFile,
    generateDOCFile,
    generateJPGFile
}
