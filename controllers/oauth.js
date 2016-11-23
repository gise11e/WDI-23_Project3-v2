const request =   require('request-promise');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret =  require('../config/tokens').secret;


function facebook(req,res) {
  console.log(req.body);
  request.get({
    url: 'https://graph.facebook.com/v2.5/oauth/access_token',
    qs: {
      code: req.body.code,
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: req.body.redirectUri
    },
    json: true
  }).then((accessToken) => {
    console.log(accessToken);
    return request.get({
      url:
      'https://graph.facebook.com/v2.5/me?fields=id,name,email,picture',
      qs: accessToken,
      json: true
    });

  }).then((profile) => {
    console.log(profile);
    //find or create a user
    console.log(profile);
    User.findOne({ email: profile.email }, (err,user) => {
      if(err) return res.status(500).json({ error: err });

      if (!user) {
        user = new User({
          facebookId: profile.id,
          profileImage: profile.picture.data.url,
          email: profile.email,
          fullName: profile.name
        });
      } else {
        user.profileImage = user.profileImage || profile.picture.data.url;
        user.facebookId = profile.id;
        // user.profileImage = profile.picture.data.url;
      }

      user.save((err, user) => {
        if(err) return res.status(400).json({ error: err });
        //generate JWT and send to the client
        const payload = { _id: user._id, username: user.username };
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });

        res.status(200).json({
          user,
          token
        });
      });
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ error: err });
  });
}

module.exports = {
  facebook
};
