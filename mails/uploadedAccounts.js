'use strict';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function uploadedAccounts(email, content) {
  const msg = {
    to: email,
    from: 'info@formuapp.com',
    templateId: 'd-4344ccaa06b646a4b1f49c78925fe09b',
    // dynamicTemplateData: {
    //   email: email,
    //   content: content,
    // },                 ----> No necesita datos
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent uploadedAccounts');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { uploadedAccounts };
