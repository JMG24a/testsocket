const { Router } = require('express');
const passport = require('passport');
const { validateToken } = require('../auth/middleware/jwt.js');
const authController = require('../controllers/auth.js');

const router = Router();

const recovery = async(req,res)=> {
  try{
    const body = req.body;
    const success = await authController.recovery(body)
    res.json({success: success})
  }catch(err){
    res.json({
      ok: false,
      msg: 'error interno, intente mas tarde',
      error: err
    })
  }
}

const changePassword = async (req,res) => {
  try{
    const {password, token} = req.body;
    const success = await authController.changePassword(token, password)
    res.json({
      ok: true,
      msg: 'Contraseña guardada',
      success
    })
  }catch(err){
    res.json({
      ok: false,
      msg: 'tiempo agotado, intente mas tarde',
      error: err
    })
  }
}

const changePasswordWhitAuth = async (req,res) => {
  try{
    const token = req.myPayload;
    const {newPassword, oldPassword} = req.body;
    const success = await authController.changePasswordWhitAuth(token, oldPassword, newPassword)
    res.json({
      ok: true,
      msg: 'Contraseña guardada',
      success
    })
  }catch(err){
    res.json({
      ok: false,
      msg: 'tiempo agotado, intente mas tarde',
      error: err
    })
  }
}

router.post('/recovery',recovery)

router.post(
  '/change/password',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  changePassword
)

router.put(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  changePasswordWhitAuth
)

module.exports = router
