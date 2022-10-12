const sgMail = require('@sendgrid/mail');
const FS = require("fs");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function contactForm(email, content, subject, file = null) {
  let msg = {}
  if(file === null){
    msg = {
      from: 'info@formuapp.com',
      to: 'info@formuapp.com',
      subject: subject,
      html: `
        <div>
        ${content}
        </div>
        `,
    };
  }else{
    const pathToAttachment = `${process.cwd()}/public/files/${file}`;
    const attachment = FS.readFileSync(pathToAttachment).toString("base64");

    msg = {
      from: 'info@formuapp.com',
      to: 'info@formuapp.com',
      subject: subject,
      html: `
        <div>
        ${content}
        </div>
        `,
      attachments: [
        {
          content: attachment,
          filename: `result.pdf`, // <= Here: made sure file name match
          type: 'application/pdf',
          disposition: "attachment"
        }
      ]
    };
  }

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
