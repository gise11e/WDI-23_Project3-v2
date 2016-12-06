const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
// const ejs = require('ejs');

function sendMail(req, res) {

  const options = {
    auth: {
      api_key: process.env.SENDGRID_APP_SECRET
    }
  };
  const htmlBody =
  `<body style="background-image: url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/bdf8b613329229.5627298ee8d84.jpg); background-repeat: no-repeat; background-size: 100%;">
  <h4 style="font-family: helvetica; color:white;background-color:#b1cbe2;border:1px solid gray; border-radius:5px; font-weight: bold;font-style:italic; padding:25px;margin: 30px 5px;"> Join me on <span style="color:red;"> ${req.body.groupName} </span>, my secret santa group!
   See you
  <a href="https://elfy-secretsanta.herokuapp.com/#/join/${req.body.groupId}" style="color:red;"> there</a> </h4>
  </body>`;
  const email = {
    to: req.body.emailArray,
    from: 'elfy.secretsanta@gmail.com',
    subject: 'Elfy',
    html: htmlBody
  };

  const mailer = nodemailer.createTransport(sgTransport(options));

  mailer.sendMail(email, function(err, res) {
    if (err) {
      console.log(err);
    }
    console.log(res);
  });
  const body = req.body;
  return res.status(200).json({
    body: body
  });
}
// sendMail();

module.exports = {
  send: sendMail
};
