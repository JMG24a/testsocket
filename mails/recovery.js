"use strict";
const nodeMailer = require('nodemailer');
const { config } = require('../config/config')

async function sendMail(email,content){

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
        user: config.smtp_u,
        pass: config.smtp_p
    }
  });

  await transporter.sendMail({
    from: 'josemorales7354@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Say Hello", // Subject line
    text: "Ya casi somos devs", // plain text body
    html: content, // html body
  });

  return { message: 'mail sent' }
}

module.exports = {sendMail}
