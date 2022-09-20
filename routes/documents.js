const { Router } = require('express');
const passport = require('passport');
const { isLoggedIn } = require('../auth/middleware/login');
const { validateToken } = require('../auth/middleware/jwt');
const ServiceDocuments = require('../services/documents');
const uploadFiles = require('../middleware/multer')

const router = Router();

const getUserDocuments = async (req, res) => {
  const {idFile} = req.params;
  console.log(idFile)
  const file = `${process.cwd()}/public/files/1663695156078.png`
  // const file = `${process.cwd()}/public/files/${body.document}`
  res.download(file);
};

const putUserDocuments = async (req, res) => {
  const body = req.body;
  const { file } = req;
  const token = req.myPayload;

  try {
    const newUser = await ServiceDocuments.putUserDocuments(token, body, file);

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

const deleteUserDocuments = async (req, res) => {
  const body = req.body;
  const token = req.myPayload;

  try {
    const newUser = await ServiceDocuments.deleteUserDocuments(token, body);

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

router.get(
  '/download/:idFile',
  getUserDocuments
);

router.put(
  '/users',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  uploadFiles(),
  putUserDocuments
);

router.put(
  '/users/delete',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  deleteUserDocuments
);


module.exports = router;
