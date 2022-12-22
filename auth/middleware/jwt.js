const { verifyJWT } = require("../tokens")

const validateToken = (req, res, next) =>{
  const token = req.headers.authorization || ''
  if(token === ''){
    res.json({
      ok: false,
      response: 'None authorization',
      error: {
        "statusCode": 401,
        "error": "None authorization",
        "message": "No tienes permisos"
      }
    })
  }
  if(token.indexOf('Bearer ') === -1) {
    res.json({
      ok: false,
      response: 'None authorization',
      error: {
        "statusCode": 401,
        "error": "None authorization",
        "message": "No tienes permisos"
      }
    })
  }
  const jwt = token.replace('Bearer ', '');
  const payload = verifyJWT(jwt)
  req.myPayload = payload
  next()
}

module.exports = { validateToken }
