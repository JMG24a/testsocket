const JWT = require('jsonwebtoken');
const  { config } = require('../../config/config')

const secret = config.tokenKey

const createJWT = (payload, options={expiresIn: '5min'}) => {
  return JWT.sign(payload, secret, options)
}

const verifyJWT = (token) => {
  const rpt =  JWT.verify(token, secret)
  return rpt
}

module.exports = { createJWT, verifyJWT }
