const { verifyJWT } = require("../tokens")

const validateToken = (req, res, next) =>{
  const token = req.headers.authorization || ''
  if(token === ''){
    res.json({response: 'None authorization'})
  }
  if(token.indexOf('Bearer ') === -1) {
    res.json({response: 'None authorization'})
  }
  const jwt = token.replace('Bearer ', '');
  const payload = verifyJWT(jwt)
  req.myPayload = payload
  next()
}

module.exports = { validateToken }
