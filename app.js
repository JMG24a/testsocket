const express = require("express");
const appRouter = require('./routes/index')
const cors = require("cors");
const { dbConnection } = require("./database/config");
const passport = require("passport");
const { passport_sessions } = require('./auth')
require("dotenv").config();
const { isLoggedIn } = require('./auth/middleware/login')
const bodyParser = require('body-parser')

// Crear el servidor de express
const app = express();

// Lectura y parseo del body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  parameterLimit:100000,
  limit: "50mb" // limite de los archivo enviados al back
}))
app.use(cors());
// Base de datos
dbConnection();

// Directorio Publico
// app.use(express.static("public")); // use es un middleware

//middleware
require('./auth')
passport_sessions(app)

//google session
app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/v1/users/auth/google')
  }
);

app.get('/home', isLoggedIn, (req,res) => {
  res.json({session: true})
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get("/logout",(req, res) =>{
  req.session.destroy();
  res.json({logout: true})
});

// Rutas
appRouter(app)
// public
app.use('/app', express.static('public'));

app.listen(process.env.PORT, () => console.log(`My app is running in: http://localhost:${process.env.PORT}`));
