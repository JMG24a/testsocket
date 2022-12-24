require('dotenv').config();

const config = {
  tokenKey: process.env.TOKEN,
  google: {
    googlePassword: process.env.GOOGLE_PASSWORD,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL
  },
  email: {
    smtp_u: process.env.SMTP_USER,
    smtp_p: process.env.SMTP_PASSWORD
  },
  myDirection: {
    myURL: process.env.MY_DIRECTION,
    myVApi: process.env.VERSION_DIRECTION
  },
  socket: process.env.SOCKET
}

module.exports = {config}
