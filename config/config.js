require('dotenv').config();

const config = {
  tokenKey: process.env.TOKEN,
  google: {
    googlePassword: process.env.GOOGLE_PASSWORD,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL
  }
}

module.exports = {config}
