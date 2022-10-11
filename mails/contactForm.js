const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function contactForm(email, content, subject) {
  console.log('SEND: ',email, content, subject)
  const msg = {
    to: 'info@formuapp.com',
    from: email,
    subject,
    html: `
      <div>
      ${content}
      </div>
      `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent Contact');
    })
    .catch((error) => {
      console.error(error.response.body);
    });
}

module.exports = { contactForm };
