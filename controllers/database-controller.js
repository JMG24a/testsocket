const databaseModel = require("../models/databases");

const getDatabases = async () => {
  const databases = await databaseModel.find();
  return databases
};

const getDatabase = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const database = await databaseModel.find({userId: id});
  return database
};

const postDatabase = async (body, token) => {
  try {
    const newDatabase = new databaseModel(body);
    const saveObject = await newDatabase.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putDatabase = async (id, body) => {
  const database = await getProperty(id);

  if (typeof database === 'string') {
    return database
  }

  const updateDatabase = await databaseModel.findByIdAndUpdate(id, body, { new: true });
  return updateDatabase
};

const deleteDatabase = async (id) => {
  const deleteDatabase = await databaseModel.findByIdAndDelete(id);
  return deleteDatabase ? true : false;
};

module.exports = {
  getDatabases,
  getDatabase,
  postDatabase,
  putDatabase,
  deleteDatabase
}
