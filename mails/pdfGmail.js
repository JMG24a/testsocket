"use strict";
const nodeMailer = require('nodemailer');
const { config } = require('../config/config')

async function pdfGmail(email, user, content, file){
  console.log('%cMyProject%cline:5%cemail', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px', email)
  console.log(user, content, file)
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      user: config.email.smtp_u,
      pass: config.email.smtp_p
    }
  });
  const root = path.join(__dirname, `/output.pdf`)
  // const root = `${process.cwd()}/public/pdf/${namePDF}.pdf`;

  await transporter.sendMail({
    from: 'formuapp22@gmail.com',
    to: email,
    subject: `FormuApp tramite PDF enviado por ${user.name}`,
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

module.exports = {pdfGmail}