const express = require("express");
const appRouter = require('./src/routes/index');
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

// Crear el servidor de express
const app = express();

// Lectura y parseo del body
app.use(express.json());
app.use(cors());
// Base de datos
dbConnection();

// Directorio Publico
// app.use(express.static("public")); // use es un middleware

//middleware
require('./auth')

// Rutas
appRouter(app)

app.listen(process.env.PORT, () => console.log(`My app is running in port: ${process.env.PORT}`));
