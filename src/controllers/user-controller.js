const UsersModel = require("../../database/models/Users");
const { security, security_confirm } = require('../../auth/middleware/security')
const { createJWT } = require('../../auth/tokens')

const getUsers = async () => {
  const users = await UsersModel.find();
  return users
};

const getUser = async (id) => {
  if(!id){
    return 'El usuario no fue encontrado'
  }
  const user = await UsersModel.findById(id);
  return user
};

const getUserByEmail = async (id) => {
  if(!id){
    return 'El usuario no fue encontrado'
  }
  const user = await UsersModel.find({email: id});
  return user
};

const postUser = async (body) => {
  try {
    const isUser = await getUserByEmail(body.email)

    if(isUser[0]?.email){
      return 'Este usuario ya existe'
    }

    if(body.password){
      const password = await security(body.password)
      body.password = password;
    }

    const user = new UsersModel(body);
    console.log(user)
    const newUser =  await user.save();

    const userInfo ={
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      lastName: newUser.lastName,
      secondLastName: newUser.secondLastName,
      photo: newUser.photo,
    }
    return userInfo
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putUser = async (id, body) => {
  const user = await getUser(id);

  if (typeof user === 'string') {
    return user
  }

  const newUser = await UsersModel.findByIdAndUpdate(id, body, { new: true });
  return newUser
};

const deleteUser = async (id) => {
  const deleteUser = await UsersModel.findByIdAndDelete(id);
  return deleteUser
};

const login = async (email, password) => {
  const user = await getUserByEmail(email)

  if(!user[0]?.email){
    return 'Este usuario no se encuentra registrado'
  }

  const isTrue = await security_confirm(password, user[0].password)
  if(!isTrue){
    return 'Autenticacion invalida'
  }

  user[0].password = null
  delete (user[0].token)
  return user
}

const AuthGoogle = async (user) => {
  const isAuth = await getUserByEmail(user._json.email)

  if(!isAuth[0]?.email){
    const userInfo = {
      email: user._json.email,
      name: user._json.given_name,
      lastName: user._json.family_name,
      photo: user._json.picture,
    }
    const response = await postUser(userInfo);
    const jwt = await signToken(response)
    console.log('RESPONSE: ',response)
    return {
      user: response,
      jwt
    }
  }else{
    const jwt = await signToken(isAuth)
    return {
      user: isAuth,
      jwt
    }
  }
}

const signToken = async(user) =>{
  const payload = {
    sub: {
      id: user?.id,
      email: user?.email
    },
    role: "admin"
  }
  const jwt = createJWT(payload)
  return jwt
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  login,
  signToken,
  AuthGoogle
}
