const User = require('../models/user');
const aws = require("aws-lib");
const rp = require("request-promise");

function usersIndex(req, res) {
  User.find((err, users) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json(users);
  });
}

function usersShow(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json(user);
  });
}

function usersUpdate(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true },  (err, user) => {
    if (err) return res.status(500).json({ message: "Something went wrong." });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json(user);
  });
}

function usersDelete(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(204).send();
  });
}

function getGifts(req,res) {

  if (req.params.store === "amazon") {

    var prodAdv = aws.createProdAdvClient('AKIAJJEADDLQEEMAGZZQ', 'SmZPIDW1ECBOsOieCVCNOULIa3tRSOEtSwGO7fqz', 'elfyapp-20');

    var options = {SearchIndex: "Blended", Keywords: req.params.keyword, ResponseGroup: 'ItemAttributes,Offers,Images'}

    prodAdv.call("ItemSearch", options, function(err, result) {
      return  res.status(200).json(result);
    })
  } else if (req.params.store === "etsy"){
    // esty api data

    var options = {
      uri: 'https://openapi.etsy.com/v2/listings/active?api_key=op20zx9os2afttxgogt9ec5a&includes=MainImage',
      qs: {
        api_key: 'op20zx9os2afttxgogt9ec5a',
        keywords: req.params.keyword,
        currency_code:'GBP'
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    rp(options)
    .then(function (repos) {
      console.log('User has %d repos', repos);
      return  res.status(200).json(repos);
    })
    .catch(function (err) {
      // API call failed...
    });


  }


}



module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete,
  gifts: getGifts
};
