"use strict";
const nodeMailer = require('nodemailer');
const { config } = require('../config/config')

async function sendMail(email,content){
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    // secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      user: config.email.smtp_u,
      pass: config.email.smtp_p
    }
  });

  transporter.verify().then(console.log).catch(console.err);

  try{
    await transporter.sendMail({
      from: 'formuapp22@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Confirmacion FormuApp", // Subject line
      text: "accede en el link para que puedas continuar", // plain text body
      html: content, // html body
    });

    return { message: 'mail sent' }
  }catch(err){
    return { error: err }
  }
}

module.exports = {sendMail}
