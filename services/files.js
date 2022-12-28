const { response } = require('express');
const { documentWithHtmlAndCss } = require('../templates');
const { pdfEmail } = require('../mails/pdfEmail.js');
const { config } = require('../config/config')
//Lib
const pdf = require('pdf-creator-node');
const Handlebars = require('handlebars');
const HTMLtoDOCX = require('html-to-docx');
const boom = require('@hapi/boom');

//Others
const { formatProcedureStages } = require('../helper/procedureStages');

generatePDFFile = (data, nameFile, res = response) => {
  const { procedure, options: userOptions } = data;
  if (!procedure) {
    throw boom.badData('La información necesaria está incompleta');
  }

  const FILE_NAME = nameFile;
  const html = documentWithHtmlAndCss(FILE_NAME);

  const options = {
    ...userOptions,
    border: '15mm',
    // header: {
    //   height: "45mm",
    //   contents: '<div style="text-align: right; color: gray;">Realizado con <b>@FormuApp</b></div>'
    // },
    footer: {
      height: '1mm',
      contents: {
        // first: 'Cover page',
        // 2: 'Second page', // Any page number is working. 1-based index
        default:
          '<div style="text-align: right; color: gray;">Realizado con <b>@FormuApp</b></div>', // fallback value
        // last: 'Last Page'
      },
    },
  };

  const document = {
    html: html,
    data: formatProcedureStages(procedure.stages) || {},
    path: './output.pdf',
    type: 'buffer',
  };

  pdf
    .create(document, options)
    .then((result) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${FILE_NAME}.pdf`
      );
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
};

generateEmailFile = async (data, nameFile, res = response) => {
  const { email, procedure } = data;
  if (!email | !procedure) {
    throw boom.badData('La información necesaria está incompleta');
  }

  const FILE_NAME = nameFile;
  const html = documentWithHtmlAndCss(FILE_NAME);

  const options = {
    format: 'Letter',
    orientation: 'portrait',
    border: '20mm',
  };

  const document = {
    html: html,
    data: formatProcedureStages(procedure.stages) || {},
    path: './output.pdf',
    type: 'buffer',
  };

  try {
    const result = await pdf.create(document, options);
    const content = `<b>Formuapp</b>`;
    await pdfEmail(
      email,
      procedure.idUsers[0],
      content,
      result,
      procedure.title
    );
    res.json({
      ok: true,
      msg: 'correo enviado',
    });
  } catch (e) {
    throw boom.badData('No se logro enviar el correo');
  }
};

generateLinkFile = async (data, nameFile = "", res = response) => {
  const { procedure } = data;
  if (!procedure) {
    throw boom.badData('La información necesaria está incompleta');
  }

  const nameFileScript = nameFile
  const idScript = procedure._id

  const generateLink = `https://app.formuapp.com/documento/src?namefile=${nameFileScript}&documentid=${idScript}`

  try {
    res.json({
      ok: true,
      msg: 'link de descarga',
      link: generateLink
    });
  } catch (e) {
    throw boom.badData('No se logro generar el enlace');
  }
};

generateXLSFile = (procedure, nameFile, res = response) => {
  //Toda la lógica necesaria para generar un archivo xls y retornarlo

  return res.status(200).json({
    ok: true,
    file: 'Archivo XLS generado',
  });
};

generateZIPFile = (procedure, nameFile, res = response) => {
  //Toda la lógica necesaria para generar un archivo zip y retornarlo

  return res.status(200).json({
    ok: true,
    file: 'Archivo ZIP generado',
  });
};

generateDOCFile = async (data, nameFile, res = response) => {
  const { procedure } = data;
  if (!procedure) {
    throw boom.badData('La información necesaria está incompleta');
  }

  const FILE_NAME = nameFile;
  let preHtml = documentWithHtmlAndCss(FILE_NAME);

  html = Handlebars.compile(preHtml)({
    data: formatProcedureStages(procedure.stages) || {},
  });
  const fileBuffer = await HTMLtoDOCX(html, null);
  res.setHeader('Content-Type', 'application/docx');
  res.setHeader('Content-Disposition', 'attachment; filename=download.docx');
  res.send(fileBuffer);
};

generateJPGFile = (procedure, nameFile, res = response) => {
  //Toda la lógica necesaria para generar un archivo jpg y retornarlo
  return res.status(200).json({
    ok: true,
    file: 'Archivo JPG generado',
  });
};

module.exports = {
  generatePDFFile,
  generateEmailFile,
  generateLinkFile,
  generateXLSFile,
  generateZIPFile,
  generateDOCFile,
  generateJPGFile,
};
