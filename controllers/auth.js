const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/tokens').secret;

const Invite = require('../models/invite');

function register(req, res){
  User.create(req.body, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });

    const payload = { _id: user._id, username: user.username };
    const token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });

    return res.status(200).json({
      message: `Welcome ${user.username}!`,
      user,
      token
    });
  });
}

function login(req, res){
  // Group.create({ groupName: 'testgroup'}, (err, group) => { console.log(group); } );
  console.log(Invite.createForGroup('582cc6030a3fcd3ea2f4d8a0', 'example@example.com'));

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const payload = { _id: user._id, username: user.username };
    const token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });

    return res.status(200).json({
      message: 'Welcome back.',
      user,
      token
    });
  });
}

module.exports = {
  register: register,
  login: login
};
