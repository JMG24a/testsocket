const { Router } = require('express');
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
      msg: 'error interno, intente mas tarde'
    })
  }
}

const changePassword = async (req,res) => {
  try{
    const {token, password} = req.body;
    const success = await authController.changePassword(token, password)
    res.json(success)
  }catch(err){
    res.json({
      ok: false,
      msg: 'tiempo agotado, intente mas tarde'
    })
  }
}

router.post('/recovery',recovery)
router.post('/recovery/password', changePassword)

module.exports = router
