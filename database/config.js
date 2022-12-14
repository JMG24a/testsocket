const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DBCNN,{
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true
    });
    console.log('DB Online');
  } catch (error) {
    console.log(error);
    throw new Error('Error a la hora de inicializar la DB');
  }
};

module.exports = { dbConnection };
