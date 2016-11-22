const mongoose  = require('mongoose');
const crypto = require('crypto');
const secret = require('../config/tokens').secret;

const states = ['created', 'sent', 'accepted', 'expired', 'cancelled'];

function toLower (v) {
  return v.toLowerCase();
}

const inviteSchema = new mongoose.Schema({
  created: { type: Date },
  expires: { type: Date },
  token: { type: String },
  email: { type: String, set: toLower },
  state: { type: String, enum: states },
  group: { type: mongoose.Schema.ObjectId, ref: 'Group' },
  acceptedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

inviteSchema.statics.createForGroup = function(groupId, email) {
  const created = new Date();

  const hash = crypto.createHmac('md5', secret);
  const token = hash.update(groupId + ':' + created).digest('hex');

  const invite = new this({
    created: created,
    expires: new Date(created.getTime() + 15*60*60*100),
    token: token,
    email: email,
    state: 'created',
    group: groupId
  });

  return invite.save();
};

module.exports = mongoose.model('Invite', inviteSchema);
