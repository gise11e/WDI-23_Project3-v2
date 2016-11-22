const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

function sendMail(mail) {

  const options = {
    auth: {
      api_key: process.env.SENDGRID_APP_SECRET
    }
  };

  const email = {
    to: mail.to,
    from: 'elfy.secretsanta@gmail.com',
    subject: mail.subject,
    text: mail.body,
    html: mail.htmlBody
  };

  const mailer = nodemailer.createTransport(sgTransport(options));

  return mailer.sendMail(email, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
}

module.exports = {
  send: sendMail
};
