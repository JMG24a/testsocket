const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb+srv://formuapp:Alejandro92!@cluster0.7elnkb7.mongodb.net");
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de inicializar la DB");
  }
};

module.exports = { dbConnection };
