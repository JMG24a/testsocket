const UsersModel = require('../models/User');
const { security, security_confirm } = require('../auth/middleware/security');
const { createJWT } = require('../auth/tokens');

const getUsers = async () => {
  const users = await UsersModel.find().populate('vehiclesOwned');
  return users;
};

const getUser = async (id) => {
  if (!id) {
    return 'El usuario no fue encontrado';
  }

  const userR = await UsersModel.findById(id)
    .populate('favoriteForms')
    .populate('vehiclesOwned')
    .populate('plan.planInfo');
  return userR;
};

const getUserByEmail = async (email) => {
  if (!email) {
    return 'El usuario no fue encontrado';
  }
  const user = await UsersModel.findOneAndUpdate(
    { email: email }, 
    { lastLoginDate: new Date().toISOString() }, 
    { new: true }
  )
    .populate('favoriteForms')
    .populate('vehiclesOwned')
    .populate('plan.planInfo');
  
  return user;
};

const postUser = async (body) => {
  const storedUser = await getUserByEmail(body.email);

  if (storedUser) {
    return 'Este usuario ya existe';
  }

  if (body.password) {
    const password = await security(body.password);
    body.password = password;
  }

  const user = new UsersModel(body);
  await user.populate('plan.planInfo');
  await user.save();

  const jwt = await signToken(user);

  return {
    user: {
      ...user.toObject(),
      password: null
    },
    token: jwt,
  };
};

const putUser = async (token, body) => {
  const user = await getUser(token.sub.id);

  if (typeof user === 'string') {
    return user;
  }

  const newUser = await UsersModel
    .findByIdAndUpdate(token.sub.id, body, {
      new: true,
    })
    .populate('favoriteForms')
    .populate('vehiclesOwned')
    .populate('plan.planInfo');
  
  newUser.password = null;
  const jwt = await signToken(newUser);

  return {
    user: newUser,
    token: jwt,
  };
};

const deleteUser = async (id) => {
  const deleteUser = await UsersModel.findByIdAndDelete(id);
  return deleteUser;
};

const login = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user) {
    return 'Este usuario no se encuentra registrado';
  }

  const isTrue = await security_confirm(password, user.password);
  if (!isTrue) {
    return 'Autenticacion invalida';
  }

  user.password = null;
  delete user.token;
  return user;
};

const AuthGoogle = async (user) => {
  const storedUser = await getUserByEmail(user._json.email);

  if (!storedUser) {
    const userInfo = {
      email: user._json.email,
      name: user._json.given_name,
      lastName: user._json.family_name,
      photo: user._json.picture,
    };

    const response = await postUser(userInfo);
    const jwt = await signToken(response);
    return {
      user: response,
      jwt,
    };
  } else {
    const jwt = await signToken(storedUser);
    return {
      user: storedUser,
      jwt,
    };
  }
};

const signToken = async (user) => {
  const payload = {
    sub: {
      id: user?.id,
      email: user?.email,
    },
    role: 'basic',
  };
  const jwt = createJWT(payload);
  return jwt;
};

const refresh = async (token) => {
  const user = await getUserByEmail(token.sub.email);

  if (user.length < 0) {
    return 'usuario no encontrado';
  }

  user[0].password = null;

  const jwt = await signToken(user[0]);
  return {
    user: user[0],
    token: jwt,
  };
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  login,
  signToken,
  AuthGoogle,
  refresh,
};
