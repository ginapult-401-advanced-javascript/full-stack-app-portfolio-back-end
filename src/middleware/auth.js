// this middleware intercepts all the requests and runs it through auth - sits through every request that needs to be authenticated
// it's checking auth headers  encrypted username passwords or JWT token
// checks for auth credentials - main goal is checking for basic or bearer auth and capability

const User = require('../models/user/schema.js');
// currying function for capabilities - pass capability in here and return function composed with that capability in mind

module.exports = (capability) => {
  // check for basic / bearer
  return (request, response, next) => {

    try {
      // split the header and make them authType and authString
      let [authType, authString] = request.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }

    } catch (error) {
      _authError(error);
    }

    function _authBasic(str) {
      let base64Buffer = Buffer.from(str, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      let auth = { username, password };

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user))
        .catch(_authError);
    }
    function _authBearer(authString) {
      // jwt has an id buried in it - rips out id credentials out of token and use it
      return User.authenticateToken(authString)
        .then(user => _authenticate(user))
        .catch(_authError);
    }
    function _authenticate(user) {
      if (user && (!capability) || (user.can(capability))) {
        request.user = user;
        request.token = user.generateToken();
        next();
      }
      else {
        _authError();
      }
    }
    function _authError() {
      next('Invalid User ID/Passworld');
    }
  };
};