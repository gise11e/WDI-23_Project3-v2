const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const validator = require('validator');


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true, message: 'you must input a unique email'},
  profileImage: {type: String, default: 'http://4.bp.blogspot.com/-SRSVCXNxbAc/UrbxxXd06YI/AAAAAAAAFl4/332qncR9pD4/s1600/default-avatar.jpg' },
  likes: { type: Array},
  dislikes: { type: Array},
  facebookId: { type: String },
  passwordHash: { type: String }
});

function setPassword(value){
  this._password = value;
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validateEmail(email) {
  if (!validator.isEmail(email)) {
    return this.invalidate('email', 'must be a valid email address');
  }
}

function validatePassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
}

function preValidate(next) {
  console.log(preValidate, this);
  if (this.isNew) {
    if (!this._password && !this.facebookId) {
      this.invalidate('password', 'A password is required.');
    }
  }

  if(this._password) {
    if (this._password.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }

    if (this._password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Passwords do not match.');
    }
  }
  next();
}

function preSave(next) {
  console.log('preSave: this:', this);
  if(this._password) {
    this.passwordHash = bcrypt.hashSync(this._password, bcrypt.genSaltSync(8));
  }

  next();
}

userSchema
  .virtual('password')
  .set(setPassword);

userSchema
  .virtual('passwordConfirmation')
  .set(setPasswordConfirmation);

userSchema
  .path('email')
  .validate(validateEmail);

userSchema.methods.validatePassword = validatePassword;

userSchema.pre('validate', preValidate);

userSchema.pre('save', preSave);

userSchema.set('toJSON', {
  transform: function(doc, json) {
    delete json.passwordHash;
    // delete json.email;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('User', userSchema);
