const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
// const ejs = require('ejs');

function sendMail(req, res) {

  // const data = {};

  // const html = ejs.renderTemplate('views/xmasTemplate.ejs', data);

  const options = {
    auth: {
      api_key: process.env.SENDGRID_APP_SECRET
    }
  };

  const textBody = `You have been invited to join a secret santa group called: ${req.body.groupName},
  If you would like to join please click this link https://elfy-secretsanta.herokuapp.com/#/join/${req.body.groupId}`;
  const htmlBody =
  `<body style="background-image: url(http://www.dear-santaclaus.co.uk/wp-content/uploads/2015/10/envelope.jpg); background-repeat: no-repeat; background-size: 80% 70%;">
  <h4 style="font-family: classic-comic, monospace;color: black; padding:90px;"> Join me on ${req.body.groupName}, <br> my Secret Santa group!
  <br> by following this <br>
  <a href="https://elfy-secretsanta.herokuapp.com/#/join/${req.body.groupId}">link</a></h4>
  </body>`;
  const email = {
    to: req.body.emailArray,
    from: 'elfy.secretsanta@gmail.com',
    subject: 'Elfy',
    text: textBody,
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


// background-image: url(../images/snow4.gif
// http://cdn.wallpapersafari.com/59/89/1ZRtkO.jpg || https://s-media-cache-ak0.pinimg.com/736x/11/a5/f5/11a5f56e768778af5c787802cd6fd539.jpg)
