const UsersModel = require('../models/User');
const { security, security_confirm } = require('../auth/middleware/security');
const { createJWT } = require('../auth/tokens');
const { welcomeMail } = require('../mails/welcome');

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
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('companies')
    .populate('profileLicense')
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
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('companies')
    .populate('profileLicense')
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

  const bodyUser = {
    ...body,
    plan: {
      planInfo: '63068b13e4bb2ceac56b77ed',
      expireDate: 'string',
    },
    profileLicense: '63068b13e4bb2ceac56b77ed',
  };



  const user = new UsersModel(bodyUser);
  await user.populate('plan.planInfo');
  await user.save();

  const jwt = await signToken(user);

  const userName = user.toObject().name;
  const email = user.toObject().email;

  const test = welcomeMail(email, userName);

  return {
    user: {
      ...user.toObject(),
      password: null,
    },
    token: jwt,
    test,
  };
};

const putUser = async (token, body) => {
  const user = await getUser(token.sub.id);

  if (typeof user === 'string') {
    return user;
  }

  const newUser = await UsersModel.findByIdAndUpdate(token.sub.id, body, {
    new: true,
  })
    .populate('favoriteForms')
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('companies')
    .populate('profileLicense')
    .populate('plan.planInfo');

  newUser.password = null;
  const jwt = await signToken(newUser);

  return {
    user: newUser,
    token: jwt,
  };
};

const putUserImage = async (token, file) => {

  let fileURL = '';
  if(file){
    fileURL = `${file.filename}`
  }

  const newUser = await UsersModel.findByIdAndUpdate(token.sub.id, {photo: fileURL}, {
    new: true,
  })
    .populate('favoriteForms')
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('companies')
    .populate('profileLicense')
    .populate('plan.planInfo');

  newUser.password = null;
  const jwt = await signToken(newUser);

  return {
    user: newUser,
    token: jwt,
  };
};

//esta funcion sera remplazada
const putUserImageLogo = async (token, file) => {
  let fileURL = '';
  if(file){
    fileURL = `${file.filename}`
  }

  const user = await getUser(token.sub.id)

  const body = {
    companyProfile:{
      ...user.companyProfile,
      photoLogo: fileURL
    }
  }

  const newUser = await UsersModel.findByIdAndUpdate(token.sub.id, body, {
    new: true,
  })
    .populate('favoriteForms')
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('companies')
    .populate('profileLicense')
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

const signToken = async (user, option) => {
  const payload = {
    sub: {
      id: user?.id,
      email: user?.email,
      savePassword: user?.savePassword
    },
    role: user.userType,
  };

  if(typeof option === "object") {
    option.expiresIn = option?.expiresIn || (user?.savePassword ? `${24*31}h` : "2h");
  } else {
    option = {
      expiresIn: user?.savePassword ? `${24*31}h` : "2h"
    }
  }
  console.log("Payload: ", payload);
  console.log("Options: ", option);

  const jwt = createJWT(payload, option);
  return jwt;
};

// const signTokenSavePass = async (user) => {
//   const option = {
//     expiresIn: `${24*31}h`
//   }
//   const payload = {
//     sub: {
//       id: user?.id,
//       email: user?.email,
//     },
//     role: user.userType,
//   };
//   const jwt = createJWT(payload, option);
//   return jwt;
// }

const refresh = async (token) => {
  const user = await getUserByEmail(token.sub.email);

  if (!user) {
    return 'usuario no encontrado';
  }
  
  user.password = null;
  const userWithPasswordPreference = {
    ...user.toObject(),
    savePassword: token.sub.savePassword
  }
  
  const jwt = await signToken(userWithPasswordPreference);
  return {
    user: userWithPasswordPreference,
    token: jwt,
  };
};

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  postUser,
  putUser,
  putUserImage,
  putUserImageLogo,
  deleteUser,
  login,
  signToken,
  // signTokenSavePass,
  AuthGoogle,
  refresh,
};
