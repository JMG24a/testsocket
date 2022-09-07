const { sendMail } = require('../mails/recovery')
const userController = require('../controllers/user-controller')
const userModel = require('../models/User')

const { createJWT } = require('../auth/tokens');

const recovery = async (body) => {
  try{
    const {email} = body
    const user = await userModel.findOne({
      where: {email: email}
    })
    if(!user){
      throw new Error('User not fount')
    }

    const jwt = await userController.signToken(user,{expiresIn: '15min'})
    const link = `http://localhost:3000/recovery?jwt=${jwt}`
    const content = `<b>Ingresa a este link => ${link}</b>`

    await US.update(user.id,{token: jwt})

    const res = await sendMail(user.email, content)

    return res
  }catch(err){
    throw boom.internal('try again later')
  }

}

const changePassword = async (token, password) => {
  const payload = verifyJWT(token);
  const user = await US.findOne(payload.sub)

  if(token !== user.recoveryToken){
    throw boom.conflict('invalid credential')
  }

  const HASH = await security(password)
  const responseUpdate = await US.update(user.id,{recoveryToken: null, password: HASH})

  delete responseUpdate.dataValues.password

  return responseUpdate
}


module.exports = {
  recovery,
  changePassword
}
