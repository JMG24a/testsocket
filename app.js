const express = require("express");
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

// Rutas
app.use("/api/v1/users", require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Helloooo... en /");
});

app.listen(process.env.PORT, () => console.log(`My app is running in port: ${process.env.PORT}`));
