const { Router } = require('express');
const passport = require('passport');
const { isLoggedIn } = require('../auth/middleware/login');
const { validateToken } = require('../auth/middleware/jwt');
const ServiceDocuments = require('../services/documents');
const multer = require('multer');

const router = Router();

const upload = multer({
  dest: 'public/files/'
})

const putUserDocuments = async (req, res) => {
  // const token = req.myPayload;
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

router.put(
  '/users',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  upload.single('file'),
  putUserDocuments
);

module.exports = router;
