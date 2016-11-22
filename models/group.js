const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  groupName: { type: String, required: true, unique: true },
  eventDate: { type: String },
  budget: { type: Number },
  groupAdmin: {type: mongoose.Schema.ObjectId, ref: 'User'},
  groupMembers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  emailArray: {type: Array },
  matches: [{
    match: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    with: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
    // groupName: { type: String, required: true, unique: true }
  }]
});

module.exports = mongoose.model('Group', groupSchema);
