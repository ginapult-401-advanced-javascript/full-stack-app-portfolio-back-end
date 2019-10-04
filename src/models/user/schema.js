// where most of the magic will happen
// what data/functionality does our User model have
// 3 important things for auth here:
// 1) username, 2) password, 3) role (authorization)

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '10m';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret';

const usedTokens = new Set();

const user = mongoose.Schema({
  username: { type: String, required:true, unique:true },
  password: { type: String, required:true },
  email: { type: String },
  role: { type: String, default:'user', enum: ['admin', 'editor', 'user'] },
});

// what do we want our users to do?
const capabilities = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: [ 'create', 'read', 'update'],
  user: ['read'],
};

// pre-hooks, anything we need to consider when making changes? that user requires when creating
user.pre('save', async function () {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
// whenever a user is saved, we want to hash the password

// ***auth?***

user.statics.createFromOauth = function (email) {
  if(!email) { return Promise.reject('Validation Error'); }
  return this.findOne({ email })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      return user;
    })
    .catch(error => {
      let username = email;
      let password = 'none';
      return this.create({ username, password, email });
    });
};

// validating tokens
// bearer auth, checking if a token is valid from a header
user.statics.authenticateToken = function (token) {

  if (usedTokens.has(token)) {
    return Promise.reject('Invalid Token');
  }
  try {
    let parsedToken = jwt.verify(token, TOKEN_SECRET);
    if((SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token)) {
      let query = { _id: parsedToken.id };
      return this.findOne(query);
    }
  }
  catch (error) {
    throw new Error('Invalid Token');
  }
};

// basic auth - a string with usernamepassword encrypted and shoved into authorization header, grabbing values from an encrypted header
user.statics.authenticateBasic = function (auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => { throw error;
    });
};

user.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

// generating tokens - capabilities baked in here - user id, type of token, capabilities of token
// on front end use JWT to unhash the token and get it out on the front end
user.methods.generateToken = function (type) {
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };

  let options = {};
  if (type !== 'key' && !!TOKEN_EXPIRE) {
    options = { expiresIn: TOKEN_EXPIRE };
  }

  return jwt.sign(token, TOKEN_SECRET, options);
};

// cabability method - does a capability exist for this user role?
user.methods.can = function (capability) {
  return capabilities[this.role].includes(capability);
};

user.methods.generateKey = function () {
  return this.generateToken('key');
};

module.exports = mongoose.model('user', user);