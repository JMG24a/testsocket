"use strict";
const sgMail = require('@sendgrid/mail');
const FS = require("fs");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function pdfEmail(email, user, content, file, nameFile) {
  let msg = {
    from: 'info@formuapp.com',
    to: email,
    templateId: 'd-6f353852a3544b0fae750b25f03f6b7b',
    dynamicTemplateData: {
      email: email,
      userName: userName,
    },
    subject: `FormuApp tramite PDF enviado por ${user.name}`,
    html: `
      <div>
        ${content}
      </div>
      `,
  }

  if(file !== null){
    const root = file.toString("base64");
    msg = {
      from: 'info@formuapp.com',
      to: email,
      templateId: 'd-6f353852a3544b0fae750b25f03f6b7b',
      dynamicTemplateData: {
        userEmail: user.email,
        userName: `${user.name} ${user.fistLastName}`,
        pdfName: nameFile
      },
      subject: `FormuApp tramite PDF enviado por ${user.name}`,
      html: `
        <div>
          ${content}
        </div>
        `,
      attachments: [
        {
          content: root,
          filename: `result.pdf`, // <= Here: made sure file name match
          type: 'application/pdf',
          disposition: "attachment"
        }
      ]
    };
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent Contact');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { pdfEmail };