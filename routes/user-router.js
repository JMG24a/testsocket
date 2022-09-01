const { Router } = require('express');
const passport = require('passport');
//services
const userController = require('../controllers/user-controller');
//middleware
// const { validatorRoles } = require('../auth/middleware/roles');
const { isLoggedIn } = require('../auth/middleware/login');
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getUsers = async (req, res) => {
  const users = await userController.getUsers();

  res.status(200).json({
    msg: 'Listado de clientes',
    users,
  });
};

const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await userController.getUser(id);

  res.status(200).json({
    msg: 'Cliente',
    user,
  });
};

const postUser = async (req, res) => {
  const body = req.body;
  try {
    const newUser = await userController.postUser(body);
    if(typeof newUser === 'string'){
      res.status(201).json({
        ok: false,
        msg: 'Error',
        success: newUser,
      });
    }else{
      res.status(201).json({
        ok: true,
        msg: 'Creado',
        success: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
};

const putUser = async (req, res) => {
  const token = req.myPayload;
  const body = req.body;

  try {
    const newUser = await userController.putUser(token, body);

    if (typeof newUser === 'string') {
      res.status(404).json({
        ok: false,
        msg: 'No Encontrado',
      });
    }

    res.status(200).json({
      ok: true,
      msg: 'Actualizado Correctamente',
      success: newUser,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const isDelete = await userController.deleteUser(id);

  res.status(200).json({
    msg: 'Listado de clientes',
    success: isDelete,
  });
};

const login = async (req, res) => {
  const user = req.user;
  if (typeof user === 'string') {
    res.status(401).json({
      msg: 'Login Error',
      success: {
        user: 'Contraseña o usuario invalido',
      },
    });
  } else {
    const token = await userController.signToken(user);
    res.status(200).json({
      msg: 'Login Success',
      success: {
        user: user,
        token,
      },
    });
  }
};

const refresh = async (req, res) => {
  const token = req.myPayload;
  const success = await userController.refresh(token);

  res.status(200).json({
    msg: '',
    success,
  });
};

const google = async (req, res) => {
  const user = req.user;
  const result = await userController.AuthGoogle(user);

  // res.status(200).json({
  //   msg: "Login Success",
  //   success: {
  //     user: result.user,
  //     token: result.jwt
  //   }
  // });

  res.redirect('http://localhost:3000/login');
};

router.get(
  '/',
  // passport.authenticate('jwt', {session: false}), validatorRoles(['admin']),
  getUsers
);
router.get('/:id', getUser);
router.post('/', postUser);

router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  putUser
);

router.delete('/:id', deleteUser);
//auth
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  login
);
router.post(
  '/refresh',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  refresh
);
router.get('/auth/google', isLoggedIn, google);

module.exports = router;
