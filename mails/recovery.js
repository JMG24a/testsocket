'use strict';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(email, content) {
  const msg = {
    to: email,
    from: 'info@formuapp.com',
    templateId: 'd-1af39804c2d642038923933bb0c93a7d',
    dynamicTemplateData: {
      email: email,
      content: content,
    },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent Recovery');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { sendMail };
