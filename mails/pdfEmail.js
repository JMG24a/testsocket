"use strict";
const sgMail = require('@sendgrid/mail');
const FS = require("fs");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function pdfEmail(email, subject, user, content, file, nameFile) {
  console.log('%cMyProject%cline:65%cnameFiles', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px', email, nameFile)

  let msg = {}

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
      subject: subject,
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
  }else{
    msg = {
      from: 'info@formuapp.com',
      to: email,
      templateId: 'd-6f353852a3544b0fae750b25f03f6b7b',
      dynamicTemplateData: {
        email: email,
        userName: userName,
      },
      subject: subject,
      html: `
        <div>
          ${content}
        </div>
        `,
    }
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
