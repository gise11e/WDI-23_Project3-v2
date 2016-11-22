const mongoose = require('mongoose');
const db = require('../config/db');
const Group = require('../models/group');
const User = require('../models/user');
mongoose.connect(db.uri);

User.collection.drop();
Group.collection.drop();

User.create([{
  fullName: 'Elfy McElface',
  email: 'elfexchange16@gmail.com',
  // likes: ['shoes'],
  // dislikes: ['fat men','pasta'],
  password: 'password',
  passwordConfirmation: 'password'
},{
  fullName: 'Kris Kringle',
  // dislikes: [
  //   'whisky',
  //   'oranges'
  // ],
  email: 'dan@properbo.co.uk',
  // likes: [
  //   'skiing'
  // ],
  password: 'password',
  passwordConfirmation: 'password'
}], (err, users) => {
  if(err) console.log('There was an error creating users', err);

  console.log(`${users.length} users created!`);

  Group.create([{
    groupName: 'Eflys Secret Santa',
    eventDate: '11/12/16',
    budget: 15,
    groupMembers: users,
    groupAdmin: users[0]
  }], (err, groups) => {
    if(err) console.log('There was an error creating groups', err);

    console.log(`${groups.length} groups created!`);
    mongoose.connection.close();
  });
});
