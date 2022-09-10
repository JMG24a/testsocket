"use strict";
const nodeMailer = require('nodemailer');
const { config } = require('../config/config')
const Path = require('path');

async function send_pdf(namePDF, email, content){
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      user: config.email.smtp_u,
      pass: config.email.smtp_p
    }
  });

  const root = `${process.cwd()}/public/pdf/${namePDF}.pdf`;

  await transporter.sendMail({
    from: 'formuapp22@gmail.com',
    to: email,
    subject: "Tramite FormuApp PDF",
    text: "con formuapp puedes facilitar todos tus tramites",
    html: content, // html body
    attachments: [
      {
          filename: `result.pdf`, // <= Here: made sure file name match
          path: root, // <= Here
          contentType: 'application/pdf'
      }
  ]
  });

  return { ok: true, message: 'mail sent' }
}

module.exports = {send_pdf}
