const UsersModel = require('../models/User');
const UserController = require('../controllers/user-controller');

const putUserDocuments = async (token, body, file) => {
  const user = await UserController.getUser(token.sub.id);

  if (typeof user === 'string') {
    return user;
  }

  let fileURL = '';
  if(file){
    fileURL = `${file.filename}`
  }


  const documents = {...user.documents}
  documents[body.document] = fileURL

  const updateUser = { documents: documents }

  const newUser = await UsersModel.findByIdAndUpdate(token.sub.id, updateUser, {
    new: true,
  })
    .populate('favoriteForms')
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('plan.planInfo');

  newUser.password = null;
  const jwt = await UserController.signToken(newUser);

  return {
    user: newUser,
    token: jwt,
  };
};

const deleteUserDocuments = async (token, body) => {
  const user = await UserController.getUser(token.sub.id);

  if (typeof user === 'string') {
    return user;
  }

  const documents = {...user.documents}
  documents[body.document] = undefined

  const updateUser = { documents: documents }

  const newUser = await UsersModel.findByIdAndUpdate(token.sub.id, updateUser, {
    new: true,
  })
    .populate('favoriteForms')
    .populate('propertiesOwned')
    .populate('vehiclesOwned')
    .populate('contacts')
    .populate('plan.planInfo');

  newUser.password = null;
  const jwt = await UserController.signToken(newUser);

  return {
    user: newUser,
    token: jwt,
  };
};

module.exports = {
  putUserDocuments,
  deleteUserDocuments
};
