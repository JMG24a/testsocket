const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { config } = require('../../../config/config')

const google_client_id = config.google.googleClientId
const google_client_secret = config.google.googleClientSecret
const callbackURL = config.google.googleCallbackUrl

const google_auth = new GoogleStrategy({
  clientID: google_client_id,
  clientSecret: google_client_secret,
  callbackURL: callbackURL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
);

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

module.exports = google_auth
