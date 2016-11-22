const mongoose = require('mongoose');
const db = require('../config/db');
const Group = require('../models/group');
const User = require('../models/user');
mongoose.connect(db.uri);

User.collection.drop();
Group.collection.drop();

User.create([{
  fullName: 'Oli',
  email: 'oli.fen@hotmail.com',
  likes: ['football', 'flags', 'pokemon', 'cats', 'ferrets', 'beer'],
  dislikes: ['carrots'],
  password: 'password',
  passwordConfirmation: 'password'
},{
  fullName: 'Elfy McElface',
  likes: ['rabbits', 'the papacy', 'chicken mcnuggets', 'bears', 'beets', 'battlestar galactica'],
  dislikes: ['water', 'oranges'],
  email: 'elfy@elfy.com',
  password: 'password',
  passwordConfirmation: 'password'
},{
  fullName: 'Dilophosaurus',
  likes: ['poison', 'frills', 'attacking people at night'],
  dislikes: ['dennis nedry'],
  email: 'dilo@dilo.com',
  password: 'password',
  passwordConfirmation: 'password'
},{
  fullName: 'Steven Gerrard',
  likes: ['liverpool', 'last minute screamers', 'istanbul'],
  dislikes: ['slip n slide', 'demba ba'],
  email: 'stevieg@stevieg.com',
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
