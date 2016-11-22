const jwt = require('jsonwebtoken');
const secret = require('../config/tokens').secret;
const Group = require('../models/group');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized'});

  const token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(token, secret, (err, payload) => {
    if(err) return res.status(401).json({ message: 'Unauthorized' });

    req.user = payload;
    next();
  });
}

function secureEmailRoute(req, res, next) {

  if(!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized'});

  const token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(token, secret, (err, payload) => {
    if(err) return res.status(401).json({ message: 'Unauthorized' });

    req.user = payload;
    const userId = req.user._id;

    Group.findById(req.params.id, (err, group) => {

      if(err) return res.status(500).json({ error: err });
      if(!group) return res.status(401).json({ message: 'Unauthorized' });

      if(group.groupAdmin.toString() !== userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    });


  });
}


module.exports ={
  secureRoute: secureRoute,
  secureEmailRoute: secureEmailRoute

};
