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

router.post('/recovery',recovery)
router.post(
  '/recovery/password',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  changePassword
)

module.exports = router
