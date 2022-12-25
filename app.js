require("dotenv").config();
//libs
const cors = require("cors");
const express = require("express");
const appRouter = require('./routes/index')
const { appSocket } = require('./server/socket-server')
const { dbConnection } = require("./database/config");
const passport = require("passport");
const { passport_sessions } = require('./auth')
const { isLoggedIn } = require('./auth/middleware/login')
const bodyParser = require('body-parser');
const { boomError } = require("./middleware/boom");

// Crear el servidor de express
const app = express();
  //instanciando server http para socket
const httpServer = require('http').createServer(app)


// Lectura y parseo del body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  parameterLimit:100000,
  limit: "50mb" // limite de los archivo enviados al back
}))

//permisos a request
app.use(cors());

//Conexion a base de datos
dbConnection();

// Directorio Publico
// app.use(express.static("public")); // use es un middleware

//middleware auth de passport
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
appSocket(httpServer)
// public
app.use('/app', express.static('public'));

app.use(boomError)

httpServer.listen(process.env.PORT, () => console.log(`My app is running in: http://localhost:${process.env.PORT}`));
