const Group = require('../models/group');
const sendmail = require('../lib/email');

function groupsIndex(req, res) {
  Group.find((err, groups) => {
    if(err) return res.status(500).json({ error: err });
    return res.json(groups);
  });
}

function groupsEdit(req, res) {
  Group.edit(req.body, (err, group) => {
    if(err) return res.status(400).json({ error: err });
    return res.json(group);
  });
}

function groupsDelete(req, res) {
  Group.findById(req.params.id, (err, group) => {
    if(err) return res.status(500).json({ error: err });
    if(!group) return res.status(404).json({ error: 'Not found' });

    group.remove(err => {
      if(err) return res.status(500).json({ error: err });
      res.status(204).send();
    });
  });
}

function groupsCreate(req, res) {
  Group.create(req.body, (err, group) => {
    if(err) return res.status(400).json({ error: err });
    return res.json(group);
  });
}

function groupsShow(req, res) {
  Group.findById(req.params.id)
  .populate('groupAdmin')
  .populate('groupMembers')
  .exec((err, group) => {
    if(err) return res.status(500).json({ error: err });
    if(!group) return res.status(404).json({ error: 'Not found' });
    return res.json(group);
  });
}


function groupsUpdate(req, res) {
  Group.findByIdAndUpdate(req.params.id, req.body, { new: true },  (err, group) => {
    console.log(req.body);
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    return res.status(200).json(group);
  });
}

function groupDraw(req, res) {
  Group.findById(req.params.id)
    .populate('groupMembers')
    .exec(
      (err, group) => {

        if (err) return res.status(400).json({ error: err });

        // check that user is group admin...
        const members = group.toObject().groupMembers;

        const shuffledMembers = ((arr) => {
          var currentIndex = arr.length, temporaryValue, randomIndex;
          while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
          }
          return arr;
        })(members);

        var emailMatches = [];
        var matches = [];

        for (var i=0; i<members.length; i++) {
          const match = shuffledMembers[i];
          const matchWith = shuffledMembers[(i+1) % members.length];
          matches.push({
            match: match._id,
            with: matchWith._id
          });
          emailMatches.push({
            id: match._id,
            matchId:matchWith._id,
            to: match.email,
            matchWithName: matchWith.fullName
          });
        }

        // send out emails.
        emailMatches.forEach((match) => {
          sendmail.send({
            to: match.to,
            subject: `${group.groupName} secret santa group has been drawn!`,
            body: `You are ${match.matchWithName} 's Secret Santa!`,
            htmlBody: `<p>You are ${match.matchWithName} 's Secret Santa!, see their profile <a href="https://elfy-secretsanta.herokuapp.com/#/profile/${match.matchId}"> here </a></p>`
            
          });
          console.log("hi",match);
        });

        group.matches = matches;

        group.save((err, group) => {
          if(err) return res.status(400).json({ error: err });
          res.json(group);
        });
      });
}

function getUsersGroups(req, res) {
  Group.find({groupMembers: req.params.id})
  .populate('matches.with')
  .exec((err, group) => {
    if(err) return res.status(400).json({ error: err });
    return res.json(group);
  });
}

function groupsGetAdmin(req, res) {
  Group.findById(req.params.id)
  .exec((err, group) => {
    if(err) return res.status(500).json({ error: err });
    if(!group) return res.status(404).json({ error: 'Not found' });
    return res.json(group.groupAdmin);
  });
}

module.exports = {
  index: groupsIndex,
  create: groupsCreate,
  edit: groupsEdit,
  delete: groupsDelete,
  show: groupsShow,
  update: groupsUpdate,
  draw: groupDraw,
  getUsersGroups: getUsersGroups,
  getGroupAdmin: groupsGetAdmin
};
