const { response } = require('express');

generatePDFFile = (procedure, res = response) => {
    //Toda la lógica necesaria para generar un archivo pdf y retornarlo
    return res.status(200).json({
        ok: true,
        file: "Archivo PDF generado"
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

generateDOCFile = (procedure, res = response) => {
    //Toda la lógica necesaria para generar un archivo doc y retornarlo
    return res.status(200).json({
        ok: true,
        file: "Archivo DOC generado"
    });
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