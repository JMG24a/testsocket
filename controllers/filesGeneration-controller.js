const { request, response } = require("express")
const fs = require("fs")
const path = require("path")

const pdf = require("pdf-creator-node")

function generatePDF(req = request, res = response) {
    // const bodydata = JSON.parse(req.body.body);
    const FILE_NAME = "mandato"

    const html = fs.readFileSync(path.join(__dirname, "../templates/pdf/" + FILE_NAME + ".html"), "utf8")

    const options = {
        format: "Letter",
        orientation: "portrait",
        border: "20mm",
        // header: {
        //     height: "45mm",
        //     contents: '<div style="text-align: center; background-color: green;">Author: Shyam Hajare</div>'
        // },
        // footer: {
        //     height: "28mm",
        //     contents: {
        //         first: 'Cover page',
        //         2: 'Second page', // Any page number is working. 1-based index
        //         default: '<span style="color: #444; background-color: green;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //         last: 'Last Page'
        //     }
        // }
    }
    
    var document = {
        html: html,
        data: {
          seller: {
            name: "Ángel García",
            documentType: "CURP",
            documentNumber: "CUGA81288919"
          },
          buyer: {
            name: "Carlos Arriaga",
            documentType: "NIT",
            documentNumber: "CARD012819201"
          },
          car: {
            licensePlate: "CH-8199-23"
          },
          contract: {
            city: "Veracruz",
            date: {
              day: "25",
              month: "diciembre",
              year: "2022"
            }
          }
        },
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

module.exports = {
    generatePDF
}