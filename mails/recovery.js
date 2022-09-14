'use strict';
const nodeMailer = require('nodemailer');
const { config } = require('../config/config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(email, content) {
  const msg = {
    to: email, // Change to your recipient
    from: 'info@formuapp.com', // Change to your verified sender
    subject: 'Reestablece tu contraseña',
    text: 'accede en el link para que puedas continuar',
    html: content,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { sendMail };
