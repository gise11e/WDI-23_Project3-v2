const Group = require('../models/group');
const sendmail = require('../lib/email');

function groupsIndex(req, res) {
  Group.find((err, groups) => {
    if(err) return res.status(500).json({ error: err });
    return res.json(groups);
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

// function groupsUpdate(req, res) {
//   Group.findById(req.params.id, (err, group) => {

//     if(err) return res.status(500).json({ error: err });
//     if(!group) return res.status(404).json({ error: 'Not found' });
//
//     for(const key in req.body) {
//       group[key] = req.body[key];
//     }
//
//     group.save((err, group) => {
//       if(err) return res.status(400).json({ error: err });
//       res.json(group);
//     });
//   });
// }


function groupsUpdate(req, res) {
  Group.findByIdAndUpdate(req.params.id, req.body, { new: true },  (err, group) => {
    console.log(req.body);
    if (err) return res.status(500).json({ message: "Something went wrong." });
    if (!group) return res.status(404).json({ message: "Group not found." });
    return res.status(200).json(group);
  });
}

// function groupDraw(req, res) {
//
//   Group.findById(req.params.id)
//     // .populate('groupMembers')
//     .exec(
//       (err, group) => {
//
//         if (err) return res.status(400).json({ error: err });
//
//         // check that user is group admin...
//         const members = group.groupMembers;
//         const cannotMatch = {
//           '582d79bf6b2c3d165162a2a3': ['582d79bf6b2c3d165162a2a4','582d9d0f397d9f1ad8510894']
//         }
//
//         members.forEach((id)=> {
//           let match = members[]
//         })
//
//
//
//         // const shuffledMembers = ((arr) => {
//         //   var currentIndex = arr.length, temporaryValue, randomIndex;
//         //   while (0 !== currentIndex) {
//         //     randomIndex = Math.floor(Math.random() * currentIndex);
//         //     currentIndex -= 1;
//         //     temporaryValue = arr[currentIndex];
//         //     arr[currentIndex] = arr[randomIndex];
//         //     arr[randomIndex] = temporaryValue;
//         //   }
//         //   return arr;
//         // })(members);
//         //
//         // var emailMatches = [];
//         // var matches = [];
//         //
//         // for (var i=0; i<members.length; i++) {
//         //   const match = shuffledMembers[i];
//         //   const matchWith = shuffledMembers[(i+1) % members.length];
//         //   matches.push({
//         //     match: match._id,
//         //     with: matchWith._id
//         //   });
//         //   emailMatches.push({
//         //     to: match.email,
//         //     matchWithName: matchWith.fullName
//         //   });
//         // }
//
//         // Blindly send out emails.
//         // emailMatches.forEach((match) => {
//         //   sendmail.send({
//         //     to: match.to,
//         //     subject: `${group.groupName} secret santa group has been drawn!`,
//         //     body: `You are ${match.matchWithName} 's Secret Santa!`,
//         //     htmlBody: `<p>You are ${match.matchWithName} 's Secret Santa!, see their profile here http://localhost:8000/#/profile/${req.body.with}</p>`
//         //   });
//         //   console.log(match.matchWithName);
//         // });
//
//         // group.matches = matches;
//
//         group.save((err, group) => {
//           if(err) return res.status(400).json({ error: err });
//           res.json(group);
//         });
//       });
// }


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
            to: match.email,
            matchWithName: matchWith.fullName
          });
        }

        // Blindly send out emails.
        emailMatches.forEach((match) => {
          sendmail.send({
            to: match.to,
            subject: `${group.groupName} secret santa group has been drawn!`,
            body: `You are ${match.matchWithName} 's Secret Santa!`,
            htmlBody: `<p>You are ${match.matchWithName} 's Secret Santa!, see their profile here http://localhost:8000/#/profile/${req.body.with}</p>`
          });
          console.log(match.matchWithName);
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

// function getUsersMatches(req, res) {
//   Group.find({matches: req.params.id}, (err, match) => {
//     if(err) return res.status(400).json({ error: err });
//     console.log(match.matches.with);
//     return res.json(match);
//   });
// }

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
  show: groupsShow,
  update: groupsUpdate,
  draw: groupDraw,
  getUsersGroups: getUsersGroups,
  getGroupAdmin: groupsGetAdmin
  // getUsersMatches: getUsersMatches
  // delete: groupsDelete
};
