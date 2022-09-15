const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function welcomeMail(email, userName) {
  const msg = {
    to: email,
    from: 'info@formuapp.com',
    templateId: 'd-b0308a10863d4cc483b3c979ba4fcef1',
    dynamicTemplateData: {
      email: email,
      userName: userName,
    },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent Welcome');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { welcomeMail };
