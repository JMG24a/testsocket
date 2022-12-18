const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function receiptMail(
  createdAt,
  expireDate,
  invoiceNo,
  userName,
  userEmail,
  amount
) {
  const msg = {
    to: userEmail,
    from: 'info@formuapp.com',
    templateId: 'd-a89f3beb4c5e4602a6d291eddc4406f0',
    dynamicTemplateData: {
      createdAt,
      expireDate,
      invoiceNo,
      userName,
      userEmail,
      amount,
    },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent Receipt');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { receiptMail };
