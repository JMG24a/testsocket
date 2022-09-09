const { sendMail } = require('../mails/recovery')
const userController = require('../controllers/user-controller')
const { verifyJWT } = require('../auth/tokens')
const { security } = require('../auth/middleware/security')

const welcome = async (email) => {
  try{
    const content = `<b>Bienvenido a Formuapp</b>`

    const res = await sendMail(email, content)

    return res
  }catch(err){
    throw new Error('try again later')
  }
}

const recovery = async (body) => {
  try{
    const {email} = body
    const user = await userController.getUserByEmail(email)

    if(!user){
      throw new Error('User not fount')
    }

    const jwt = await userController.signToken(user, {expiresIn: '15min'})

    const link = `http://localhost:3000/login?recovery=${jwt}`
    const content = `<b>Ingresa a este link => ${link}</b>`

    const idToken = { sub: {id: user.id}};

    await userController.putUser(idToken, {token: jwt})

    const res = await sendMail(user.email, content)

    return res
  }catch(err){
    throw new Error('try again later')
  }
}

const changePassword = async (token, password) => {
  const payload = verifyJWT(token);

  const user = await userController.getUserByEmail(payload.sub.email)

  if(token !== user.token){
    throw new Error('invalid credential')
  }

  const idToken = { sub: {id: user.id}};

  const jwt = await userController.signToken(user, {expiresIn: '2h'})

  const HASH = await security(password)
  const responseUpdate = await userController.putUser(idToken, {token: "", password: HASH})

  return {
    user: responseUpdate,
    token: jwt
  }
}


module.exports = {
  welcome,
  recovery,
  changePassword
}
