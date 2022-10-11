const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function contactForm(email, content) {
  const msg = {
    to: 'info@formuapp.com',
    from: email,
    subject: 'Nuevo correo de contacto',
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
      console.error(error);
    });
}

module.exports = { contactForm };
