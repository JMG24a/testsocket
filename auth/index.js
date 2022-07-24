const session = require("express-session")
const passport = require('passport');
const local_auth = require('./strategies/local')
const JWT_auth = require('./strategies/jwt')
const google_auth = require('./strategies/google')
const { config } = require('../config/config')

const googleKey = config.google.googlePassword;

passport.use(local_auth)
passport.use(JWT_auth)
passport.use(google_auth)

function passport_sessions (app){
  app.use(session({
    secret: googleKey,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports = {passport_sessions}
