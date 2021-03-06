const superagent = require('superagent');
const Users = require('../../model/user/schema.js');

const authorize = (request) => {
  let code = request.query.code;
  return superagent.post('https://www.gogleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirec_uri: `${process.env.API_URL}/oauth`,
      grant_type: 'authorization_code',
    })
    .then(response => {
      let access_token = response.body.access_token;
      return access_token;
    })
    .then(token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          let user = response.body;
          user.access_token = token;
          return user;
        });
    })
    .then(oauthUser => {
      return Users.createFromOAuth(oauthUser);
    })
    .then(actualRealUser => {
      return actualRealUser.generateToken();
    })
    .catch(error => error);
};

module.exports = { authorize };